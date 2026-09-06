// Runs after the client and SSR builds: renders every route through the real
// React app, writes the static pages, and emits sitemap, robots, and feed.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ORIGIN = "https://zent7x.com";
const SITE_NAME = "zentex";
// "/" for production; "/pr-preview/pr-N/" when building a pull request preview.
const BASE = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");
const preview = BASE !== "/";
const dist = resolve("dist");
const ssrDir = join(dist, ".ssr");

const ssr = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
const { posts, profile } = ssr;
// React hoists a preload for every <img>; the images are in the markup already
// and the hints would only outrank the font preloads.
const render = (path) => ssr.render(path).replace(/<link rel="preload" as="image" href="[^"]*"\/>/g, "");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const newestPost = posts.map((p) => p.date).sort().at(-1);

// Last commit date touching the given files; falls back to the newest post so
// a checkout without history still produces a valid sitemap.
function gitDate(...files) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : newestPost;
  } catch {
    return newestPost;
  }
}

const later = (...dates) => dates.filter(Boolean).sort().at(-1);

const person = {
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: profile.name,
  alternateName: profile.alias,
  url: `${ORIGIN}/`,
};

const crumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: url,
  })),
});

function routes() {
  const homeMod = later(gitDate("src/data/site.ts", "src/components/Home.tsx", "index.html"), newestPost);
  const pagesMod = gitDate("src/components/Pages.tsx");
  return [
    {
      path: "/",
      title: "zentex · Adeeb",
      description:
        "Adeeb, also zentex. Founder of warm.run and routing.run. Authorized security research from Kashmir.",
      lastmod: homeMod,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${ORIGIN}/#website`,
          name: SITE_NAME,
          url: `${ORIGIN}/`,
          author: person,
          inLanguage: "en",
        },
      ],
    },
    {
      path: "/blog",
      title: "Writing · zentex",
      description: "Short posts about LLM routing, agent loops, terminals, and security work by Adeeb (zentex).",
      lastmod: newestPost,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${ORIGIN}/blog#blog`,
          name: "Notes from the loop",
          url: `${ORIGIN}/blog`,
          author: person,
          inLanguage: "en",
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            "@id": `${ORIGIN}/blog/${p.slug}#post`,
            headline: p.title,
            url: `${ORIGIN}/blog/${p.slug}`,
            datePublished: p.date,
          })),
        },
        crumb([
          [SITE_NAME, `${ORIGIN}/`],
          ["Writing", `${ORIGIN}/blog`],
        ]),
      ],
    },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      title: `${p.title} · zentex`,
      description: p.summary,
      lastmod: p.date,
      article: p,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${ORIGIN}/blog/${p.slug}#post`,
          headline: p.title,
          description: p.summary,
          url: `${ORIGIN}/blog/${p.slug}`,
          datePublished: p.date,
          dateModified: p.date,
          author: person,
          publisher: person,
          image: `${ORIGIN}/media/og.jpg`,
          mainEntityOfPage: `${ORIGIN}/blog/${p.slug}`,
          isPartOf: { "@id": `${ORIGIN}/blog#blog` },
          inLanguage: "en",
          wordCount: p.body.join(" ").split(/\s+/).length,
        },
        crumb([
          [SITE_NAME, `${ORIGIN}/`],
          ["Writing", `${ORIGIN}/blog`],
          [p.title, `${ORIGIN}/blog/${p.slug}`],
        ]),
      ],
    })),
    {
      path: "/privacy",
      title: "Privacy · zentex",
      description: "How zent7x.com treats your data: no accounts, no analytics, no tracking cookies.",
      lastmod: pagesMod,
    },
    {
      path: "/terms",
      title: "Terms · zentex",
      description: "Terms for zent7x.com: content ownership, open source licenses, and authorized security work only.",
      lastmod: pagesMod,
    },
  ];
}

function fontPreloads() {
  const wanted = ["geist-sans-latin-400-normal", "geist-sans-latin-600-normal", "geist-mono-latin-400-normal"];
  const files = readdirSync(join(dist, "assets")).filter((f) => f.endsWith(".woff2"));
  return wanted
    .map((stem) => files.find((f) => f.startsWith(`${stem}-`)))
    .filter(Boolean)
    .map((f) => `<link rel="preload" href="${BASE}assets/${f}" as="font" type="font/woff2" crossorigin />`);
}

function renderPage(template, r) {
  const url = `${ORIGIN}${r.path === "/" ? "/" : r.path}`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace('<div id="root"></div>', `<div id="root">${render(r.path)}</div>`);
  if (r.article) {
    html = html
      .replace(/(<meta property="og:type" content=")website(")/, "$1article$2")
      .replace(
        '<meta property="og:url"',
        [
          `<meta property="article:published_time" content="${r.article.date}" />`,
          `<meta property="article:modified_time" content="${r.article.date}" />`,
          `<meta property="article:author" content="${ORIGIN}/" />`,
          '<meta property="og:url"',
        ].join("\n    "),
      );
  }
  const scripts = (r.jsonLd ?? []).map(
    (obj) => `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>\n`,
  );
  return html.replace("</head>", `${scripts.join("")}  </head>`);
}

const all = routes();
let template = readFileSync(join(dist, "index.html"), "utf8").replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  ['<meta name="viewport" content="width=device-width, initial-scale=1.0" />', ...fontPreloads()].join("\n    "),
);
// A preview is a copy of the site at another URL: keep it out of the index.
if (preview) template = template.replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex" />');

for (const r of all) {
  const page = renderPage(template, r);
  if (r.path === "/") {
    writeFileSync(join(dist, "index.html"), page);
    continue;
  }
  // GitHub Pages serves /blog/foo from blog/foo.html (no redirect) and
  // /blog/foo/ from blog/foo/index.html, so emit both.
  const flat = join(dist, `${r.path.slice(1)}.html`);
  const nested = join(dist, r.path.slice(1), "index.html");
  mkdirSync(dirname(nested), { recursive: true });
  writeFileSync(flat, page);
  writeFileSync(nested, page);
}

// Unknown paths: SPA fallback that search engines must not index.
writeFileSync(
  join(dist, "404.html"),
  template
    .replace(/<title>[^<]*<\/title>/, "<title>404 · zentex</title>")
    .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex" />')
    .replace(/<link rel="canonical" href="[^"]*" \/>\n?\s*/, "")
    .replace('<div id="root"></div>', `<div id="root">${render("/404")}</div>`),
);

// GitHub Pages runs Jekyll on branch deploys unless told not to, and Jekyll
// drops dotfiles such as .well-known/security.txt.
writeFileSync(join(dist, ".nojekyll"), "");

if (preview) {
  rmSync(join(dist, "CNAME"), { force: true });
  console.log(`prerendered ${all.length} routes as a preview under ${BASE}`);
  rmSync(ssrDir, { recursive: true, force: true });
  process.exit(0);
}

writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all
    .map((r) => `  <url><loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc><lastmod>${r.lastmod}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);

writeFileSync(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /pr-preview/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);

const rfc822 = (date) => new Date(`${date}T00:00:00Z`).toUTCString();
writeFileSync(
  join(dist, "feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>zentex · Writing</title>
    <link>${ORIGIN}/blog</link>
    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Short posts about LLM routing, agent loops, terminals, and security work by Adeeb (zentex).</description>
    <language>en</language>
    <lastBuildDate>${rfc822(newestPost)}</lastBuildDate>
${[...posts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${ORIGIN}/blog/${p.slug}</link>
      <guid isPermaLink="true">${ORIGIN}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.body.map((para) => `<p>${esc(para)}</p>`).join(""))}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`,
);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${all.length} routes, sitemap, robots, feed`);
