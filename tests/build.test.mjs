import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../scripts/build.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = [
  'blog', 'privacy', 'terms', 'blog/authorized-means-written',
  'blog/chromium-in-the-terminal', 'blog/pack-the-repo-not-the-prompt',
  'blog/zero-prompt-logging',
];

async function buildTemporary(t, basePath) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'zentex-build-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const output = path.join(temporary, 'dist');
  await buildSite({ root, output, basePath });
  return output;
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(filename));
    else if (entry.name.endsWith('.html')) files.push(filename);
  }
  return files;
}

test('production preserves complete routes, homepage, domain, and required assets', async (t) => {
  const output = await buildTemporary(t, '/');
  assert.equal(await readFile(path.join(output, 'index.html'), 'utf8'),
    await readFile(path.join(root, 'index.html'), 'utf8'));
  for (const route of routes) {
    const published = await readFile(path.join(root, 'public', `${route}.html`), 'utf8');
    assert.equal(await readFile(path.join(output, `${route}.html`), 'utf8'), published);
    assert.equal(await readFile(path.join(output, route, 'index.html'), 'utf8'), published);
    assert.match(published, /<div id="root">/);
  }
  for (const relative of [
    'CNAME', '.nojekyll', '.well-known/security.txt', '404.html', 'feed.xml',
    'sitemap.xml', 'robots.txt', 'BingSiteAuth.xml', 'portfolio.css', 'site.js',
    'chess.js', 'vendor/chess.mjs', 'contribution-calendar.mjs',
    'assets/index-BxapVFDQ.js', 'assets/index-D9PNUije.css', 'media/og.jpg',
  ]) await access(path.join(output, relative));
});

test('preview rewrites homepage assets, keeps canonical metadata, and sends articles to production', async (t) => {
  const output = await buildTemporary(t, '/pr-preview/pr-27');
  const homepage = await readFile(path.join(output, 'index.html'), 'utf8');
  assert.match(homepage, /<link rel="canonical" href="https:\/\/zent7x\.com\/"/);
  assert.match(homepage, /<meta property="og:url" content="https:\/\/zent7x\.com\/"/);
  assert.match(homepage, /href="https:\/\/zent7x\.com\/feed\.xml"/);
  assert.match(homepage, /href="https:\/\/zent7x\.com\/blog\/pack-the-repo-not-the-prompt"/);
  assert.match(homepage, /href="https:\/\/zent7x\.com\/privacy"/);
  assert.match(homepage, /src="\/pr-preview\/pr-27\/logos\/chess\.svg"/);
  assert.match(homepage, /href="#about"/);
  await assert.rejects(access(path.join(output, 'CNAME')), { code: 'ENOENT' });

  // Both relative and absolute homepage asset URLs must stay inside the preview.
  const previewURL = 'https://zent7x.com/pr-preview/pr-27/';
  const tags = homepage.match(/<(?:script|img|use|link)\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (/\brel="(?:canonical|alternate)"/i.test(tag)) continue;
    for (const match of tag.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const url = new URL(match[1], previewURL);
      if (url.origin !== 'https://zent7x.com') continue;
      assert.ok(url.pathname.startsWith('/pr-preview/pr-27/'), url.href);
      await access(path.join(output, url.pathname.slice('/pr-preview/pr-27/'.length)));
    }
  }
});

test('every preview HTML page is noindex and preserved routes redirect without legacy hydration', async (t) => {
  const output = await buildTemporary(t, '/pr-preview/pr-27/');
  for (const filename of await htmlFiles(output)) {
    const html = await readFile(filename, 'utf8');
    assert.equal((html.match(/<meta name="robots" content="noindex,follow"/g) || []).length, 1, filename);
    assert.doesNotMatch(html, /<meta\b[^>]*content="index[,\s"]/i, filename);
  }
  for (const route of routes) {
    for (const relative of [`${route}.html`, `${route}/index.html`]) {
      const html = await readFile(path.join(output, relative), 'utf8');
      assert.ok(html.includes(`content="0;url=https://zent7x.com/${route}"`));
      assert.ok(html.includes(`rel="canonical" href="https://zent7x.com/${route}"`));
      assert.doesNotMatch(html, /<script\b/i);
    }
  }
  assert.equal(await readFile(path.join(output, 'assets/index-BxapVFDQ.js'), 'utf8'),
    await readFile(path.join(root, 'public/assets/index-BxapVFDQ.js'), 'utf8'));
});
