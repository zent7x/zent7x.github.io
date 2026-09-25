import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const origin = "https://zent7x.com";
const articles = [
  "authorized-means-written",
  "chromium-in-the-terminal",
  "pack-the-repo-not-the-prompt",
  "zero-prompt-logging",
];
const routes = ["blog", "privacy", "terms", ...articles.map((slug) => `blog/${slug}`)];

function decode(value = "") {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (entity.startsWith("#")) {
      return String.fromCodePoint(entity[1].toLowerCase() === "x"
        ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10));
    }
    return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[entity.toLowerCase()];
  });
}

// Read static tags only: these smoke checks must not depend on JavaScript rendering.
function tags(html, name) {
  const pattern = new RegExp(`<${name}\\b(?:[^<>"']|"[^"]*"|'[^']*')*>`, "gi");
  return [...html.matchAll(pattern)].map(([tag]) => {
    const attributes = {};
    for (const match of tag.replace(/^<\w+\b/, "").matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      attributes[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
    }
    return attributes;
  });
}

async function page(relativePath) {
  const html = await readFile(new URL(relativePath, root), "utf8");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, `${relativePath} has a static head`);
  const meta = new Map();
  for (const tag of tags(head, "meta")) {
    const key = (tag.name || tag.property || "").toLowerCase();
    if (!key) continue;
    if (/^(og:|twitter:)|^(description|robots)$/.test(key)) {
      assert.ok(!meta.has(key), `${relativePath} must not duplicate ${key}`);
    }
    meta.set(key, tag.content);
  }
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert.equal(titles.length, 1, `${relativePath} has one title`);
  const title = decode(titles[0][1]).trim();
  assert.ok(title && meta.get("description")?.trim(), `${relativePath} has a title and description`);
  const canonicals = tags(head, "link").filter((tag) => tag.rel?.split(/\s+/).includes("canonical"));
  const schema = [];
  for (const match of head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (tags(`<script${match[1]}>`, "script")[0]?.type === "application/ld+json") {
      schema.push(JSON.parse(match[2]));
    }
  }
  return { html, head, meta, title, canonicals, schema };
}

function objects(value) {
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(objects)];
}

function nodesOfType(schema, type) {
  return objects(schema).filter((node) => [node["@type"]].flat().includes(type));
}

function canonical(p, expected) {
  assert.equal(p.canonicals.length, 1, `${expected} has one canonical`);
  assert.equal(p.canonicals[0].href, expected);
  assert.equal(p.meta.get("og:url"), expected, "Open Graph uses the same canonical URL");
}

function robots(p) {
  return (p.meta.get("robots") || "").toLowerCase().split(/[\s,]+/);
}

async function localImage(url) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, origin, "Social images are served from the published site");
  const data = await readFile(new URL(`public${parsed.pathname}`, root));
  assert.ok(data.length > 0, `${url} exists in the deployment source`);
  return data;
}

test("homepage has descriptive, consistent metadata and a usable sharing image", async () => {
  const p = await page("index.html");
  canonical(p, `${origin}/`);
  assert.match(p.title, /Adeeb Bashir/i);
  assert.match(p.title, /zentex/i);
  assert.match(p.title, /founder|security|engineer/i, "Title explains who the portfolio belongs to");
  assert.equal(robots(p).includes("noindex"), false);
  assert.equal(p.meta.get("og:type"), "website");
  assert.ok(p.meta.get("og:title")?.trim());
  assert.ok(p.meta.get("og:description")?.trim());
  assert.equal(p.meta.get("twitter:card"), "summary_large_image");
  assert.equal(p.meta.get("twitter:image"), p.meta.get("og:image"));
  assert.ok(p.meta.get("og:image:alt")?.trim(), "Shared image has an accessible description");
  for (const field of ["title", "description"]) {
    if (p.meta.has(`twitter:${field}`)) {
      assert.equal(p.meta.get(`twitter:${field}`), p.meta.get(`og:${field}`));
    }
  }
  const image = await localImage(p.meta.get("og:image"));
  assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], "Preview is a PNG, not a mislabeled SVG");
  assert.equal(image.toString("ascii", 12, 16), "IHDR");
  const dimensions = [image.readUInt32BE(16), image.readUInt32BE(20)];
  assert.deepEqual(dimensions, [1200, 630]);
  assert.deepEqual([Number(p.meta.get("og:image:width")), Number(p.meta.get("og:image:height"))], dimensions);
  const feed = tags(p.head, "link").find((tag) => tag.rel === "alternate" && tag.type === "application/rss+xml");
  assert.ok(feed, "RSS is discoverable from the homepage head");
  assert.equal(new URL(feed.href, `${origin}/`).href, `${origin}/feed.xml`);
});

test("homepage identifies its person consistently with the article author references", async () => {
  const p = await page("index.html");
  const people = nodesOfType(p.schema, "Person");
  const person = people.find((node) => node["@id"] === `${origin}/#person`);
  assert.ok(person, "The homepage defines the Person used by published articles");
  assert.match(person.name, /Adeeb Bashir/i);
  assert.equal(person.url, `${origin}/`);
  const profiles = new Set([person.sameAs].flat());
  for (const url of [
    "https://github.com/zent7x",
    "https://x.com/zent7x",
    "https://www.linkedin.com/in/adeeb-ahmad-555131340/",
  ]) assert.ok(profiles.has(url), `Person retains verified profile ${url}`);
  const profile = nodesOfType(p.schema, "ProfilePage").find((node) => node.url === `${origin}/`);
  assert.ok(profile, "A ProfilePage describes the portfolio");
  assert.equal(profile.mainEntity?.["@id"], person["@id"]);
  const website = nodesOfType(p.schema, "WebSite").find((node) => node.url === `${origin}/`);
  assert.ok(website?.name, "Site identity is present in structured data");
});

test("all preserved pages keep static metadata, article content, and indexing intent", async () => {
  const titles = new Set();
  const home = await page("index.html");
  const homeLinks = new Set(tags(home.html, "a").filter((tag) => tag.href)
    .map((tag) => new URL(tag.href, `${origin}/`).href));
  for (const route of routes) {
    const p = await page(`public/${route}.html`);
    const url = `${origin}/${route}`;
    canonical(p, url);
    assert.ok(!titles.has(p.title), `${route} has a distinct title`);
    titles.add(p.title);
    const heading = p.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
    assert.ok(heading && decode(heading.replace(/<[^>]*>/g, "")).trim(), `${route} has a server-rendered heading`);
    await localImage(p.meta.get("og:image"));
    if (route === "privacy" || route === "terms") {
      assert.ok(robots(p).includes("noindex"), `${route} keeps its intentional noindex`);
      continue;
    }
    assert.equal(robots(p).includes("noindex"), false, `${route} remains indexable`);
    if (!route.startsWith("blog/")) continue;
    assert.ok(homeLinks.has(url), `${route} is linked in source HTML without requiring search or clicks`);
    const post = nodesOfType(p.schema, "BlogPosting").find((node) => node.url === url);
    assert.ok(post?.headline, `${route} has BlogPosting metadata`);
    assert.equal(post.author?.["@id"], `${origin}/#person`);
    assert.equal(post.image, p.meta.get("og:image"));
    assert.ok(Number.isFinite(Date.parse(post.datePublished)), `${route} has a valid publication date`);
    assert.ok(Number.isFinite(Date.parse(post.dateModified)), `${route} has a valid modification date`);
  }
  const notFound = await page("public/404.html");
  assert.ok(robots(notFound).includes("noindex"), "The 404 page cannot enter search results");
  assert.equal(notFound.canonicals.length, 0, "The 404 page does not canonicalize errors to the homepage");
});

test("robots and sitemap expose canonical content without inventing modification dates", async () => {
  const robotsText = await readFile(new URL("public/robots.txt", root), "utf8");
  assert.match(robotsText, /^Sitemap:\s*https:\/\/zent7x\.com\/sitemap\.xml\s*$/mi);
  assert.doesNotMatch(robotsText, /^Disallow:\s*\/\s*$/mi, "The site is not globally blocked");
  const sitemap = await readFile(new URL("public/sitemap.xml", root), "utf8");
  const entries = [...sitemap.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/g)].map((match) => ({
    url: decode(match[1].match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim()),
    modified: match[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim(),
  }));
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
  assert.equal(byUrl.size, entries.length, "Sitemap has no duplicate URLs");
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, origin);
    assert.equal(url.hash, "", "Fragment navigation is not a separate indexable page");
    assert.equal(url.search, "");
    if (entry.modified) assert.ok(Number.isFinite(Date.parse(entry.modified)));
  }
  const homepage = byUrl.get(`${origin}/`);
  assert.ok(homepage?.modified && homepage.modified >= "2026-09-25", "Homepage reflects its substantive September 25 update");
  assert.ok(byUrl.has(`${origin}/blog`));
  for (const slug of articles) {
    const url = `${origin}/blog/${slug}`;
    const entry = byUrl.get(url);
    assert.ok(entry, `${slug} remains discoverable`);
    const p = await page(`public/blog/${slug}.html`);
    const post = nodesOfType(p.schema, "BlogPosting").find((node) => node.url === url);
    assert.equal(entry.modified?.slice(0, 10), post.dateModified.slice(0, 10), `${slug} retains its actual content modification date`);
  }
  for (const route of ["privacy", "terms", "404.html"]) {
    assert.equal(byUrl.has(`${origin}/${route}`), false, `${route} is excluded because it is noindex`);
  }
});
