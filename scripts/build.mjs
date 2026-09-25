import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://zent7x.com';
const preservedRoutes = [
  'blog', 'privacy', 'terms',
  'blog/authorized-means-written', 'blog/chromium-in-the-terminal',
  'blog/pack-the-repo-not-the-prompt', 'blog/zero-prompt-logging',
];

function normalizeBasePath(value) {
  if (!/^\/(?!\/)[A-Za-z0-9_/-]*$/.test(value)) {
    throw new Error('BASE_PATH must be a root-relative directory path.');
  }
  return value.endsWith('/') ? value : `${value}/`;
}

function noindex(html) {
  return html
    .replace(/<meta\b(?=[^>]*\bname\s*=\s*["'](?:robots|googlebot|bingbot)["'])[^>]*>/gi, '')
    .replace(/<head\b[^>]*>/i, '$&\n  <meta name="robots" content="noindex,follow" />');
}

function previewHomepage(html, base) {
  // Pages outside this homepage deliberately remain production destinations.
  // Only root-relative asset URLs move under the preview's directory; metadata
  // and absolute canonical, Open Graph, and RSS URLs remain production URLs.
  const links = html.replace(/<a\b[^>]*>/gi, (tag) => tag.replace(
    /\bhref=(['"])(\/(?!\/)[^'"]*)\1/gi,
    (_, quote, href) => `href=${quote}${origin}${href}${quote}`,
  ));
  return noindex(links.replace(/\b(href|src|poster)=(['"])(\/(?!\/)[^'"]*)\2/gi,
    (_, attribute, quote, url) => {
      const pathname = url.split(/[?#]/, 1)[0];
      const target = pathname === '/feed.xml' ? `${origin}${url}` : `${base}${url.slice(1)}`;
      return `${attribute}=${quote}${target}${quote}`;
    }));
}

function productionRedirect(route) {
  const canonical = `${origin}/${route}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href="${canonical}" />
  <meta http-equiv="refresh" content="0;url=${canonical}" />
  <title>Continue to zentex</title>
</head>
<body><p><a href="${canonical}">Continue to this page</a></p></body>
</html>
`;
}

async function markPreviewPages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await markPreviewPages(filename);
    else if (entry.name.endsWith('.html')) {
      await writeFile(filename, noindex(await readFile(filename, 'utf8')));
    }
  }
}

export async function buildSite({
  root = repositoryRoot,
  output = path.join(root, 'dist'),
  basePath = process.env.BASE_PATH || '/',
} = {}) {
  const base = normalizeBasePath(basePath);
  const preview = base !== '/';
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const file of ['index.html', 'site.js']) {
    await cp(path.join(root, file), path.join(output, file));
  }
  await cp(path.join(root, 'public'), output, { recursive: true });

  // Production gets complete directory indexes as well as extensionless .html
  // pages. In PR previews these routes redirect to production: the preserved
  // React bundle assumes root routing and cannot safely hydrate under a prefix.
  // No opaque JavaScript is modified to work around that assumption.
  for (const route of preservedRoutes) {
    const page = preview ? productionRedirect(route)
      : await readFile(path.join(output, `${route}.html`), 'utf8');
    const directory = path.join(output, route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), page);
    if (preview) await writeFile(path.join(output, `${route}.html`), page);
  }

  if (preview) {
    await rm(path.join(output, 'CNAME'), { force: true });
    const homepage = await readFile(path.join(output, 'index.html'), 'utf8');
    await writeFile(path.join(output, 'index.html'), previewHomepage(homepage, base));
    await markPreviewPages(output);
  }
  return { output, base, preview, routeCount: preservedRoutes.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = await buildSite();
  console.log(`Built homepage and ${result.routeCount} preserved routes in dist/${result.preview ? ` (preview: ${result.base})` : ''}.`);
}
