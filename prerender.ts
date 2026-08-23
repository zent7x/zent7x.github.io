import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { Plugin } from "vite";
import { posts, profile } from "./src/data/site";

const ORIGIN = "https://zent7x.com";
const SITE_NAME = "zentex";

type Route = {
  path: string;
  title: string;
  description: string;
  lastmod: string;
  body: string;
  jsonLd?: object;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function routes(): Route[] {
  const newest = posts.map((p) => p.date).sort().at(-1) ?? "2026-08-23";
  const person = {
    "@type": "Person",
    name: profile.name,
    alternateName: profile.alias,
    url: `${ORIGIN}/`,
  };
  return [
    {
      path: "/",
      title: "zentex · Adeeb",
      description:
        "Adeeb, also zentex. Founder of routing.run and Keelcode. Authorized security research from Kashmir.",
      lastmod: newest,
      body: `<h1>hey, i’m adeeb, also zentex.</h1>
<p>founder and security researcher in kashmir, building routing.run and keelcode. i work on llm routing, agent loops, and local developer tools, and i take authorized security engagements.</p>
<h2>Writing</h2><ul>${posts.map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a></li>`).join("")}</ul>`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${ORIGIN}/`,
        author: person,
      },
    },
    {
      path: "/blog",
      title: "Writing · zentex",
      description: "Short posts about LLM routing, agent loops, terminals, and security work by Adeeb (zentex).",
      lastmod: newest,
      body: `<h1>Notes from the loop</h1><ul>${posts
        .map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> <time datetime="${p.date}">${p.date}</time><p>${esc(p.summary)}</p></li>`)
        .join("")}</ul>`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Notes from the loop",
        url: `${ORIGIN}/blog`,
        author: person,
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${ORIGIN}/blog/${p.slug}`,
          datePublished: p.date,
        })),
      },
    },
    ...posts.map<Route>((p) => ({
      path: `/blog/${p.slug}`,
      title: `${p.title} · zentex`,
      description: p.summary,
      lastmod: p.date,
      body: `<article><h1>${esc(p.title)}</h1><time datetime="${p.date}">${p.date}</time>${p.body
        .map((para) => `<p>${esc(para)}</p>`)
        .join("")}</article>`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.summary,
        url: `${ORIGIN}/blog/${p.slug}`,
        datePublished: p.date,
        dateModified: p.date,
        author: person,
        publisher: person,
        image: `${ORIGIN}/media/og.jpg`,
        mainEntityOfPage: `${ORIGIN}/blog/${p.slug}`,
        inLanguage: "en",
      },
    })),
    {
      path: "/privacy",
      title: "Privacy · zentex",
      description: "How zent7x.com treats your data: no accounts, no analytics, no tracking cookies.",
      lastmod: "2026-08-23",
      body: "<h1>How this site treats your data</h1><p>No accounts, no analytics pixel, no tracking cookies.</p>",
    },
    {
      path: "/terms",
      title: "Terms · zentex",
      description: "Terms for zent7x.com: content ownership, open source licenses, and authorized security work only.",
      lastmod: "2026-08-23",
      body: "<h1>A short note, not a novel</h1><p>Consulting starts only after a written yes. Security work is authorized work only.</p>",
    },
  ];
}

function renderPage(template: string, r: Route): string {
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
    .replace('<div id="root"></div>', `<div id="root">${r.body}</div>`);
  if (r.path !== "/") html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/, "");
  if (r.path.startsWith("/blog/")) html = html.replace(/(<meta property="og:type" content=")website(")/, "$1article$2");
  if (r.jsonLd) {
    html = html.replace(
      "</head>",
      `    <script type="application/ld+json">\n${JSON.stringify(r.jsonLd, null, 2)}\n    </script>\n  </head>`,
    );
  }
  return html;
}

export function prerender(): Plugin {
  return {
    name: "prerender-routes",
    apply: "build",
    closeBundle() {
      const dist = resolve("dist");
      const template = readFileSync(join(dist, "index.html"), "utf8");
      const all = routes();
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
          .replace(/<link rel="canonical" href="[^"]*" \/>\n?/, ""),
      );
      writeFileSync(
        join(dist, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all
          .map((r) => `  <url><loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc><lastmod>${r.lastmod}</lastmod></url>`)
          .join("\n")}\n</urlset>\n`,
      );
      writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
    },
  };
}
