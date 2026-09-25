# Preserved production routes

The homepage redesign retains the site's published writing and legal pages in
`public/`. These are opaque, built deployment artifacts copied from
`zent7x/zent7x.github.io` commit
`1f72fd008f330c581a54ffe569f99ad5e2e01429` (`gh-pages`, September 20, 2026).
That deployment names source commit `f4e79b95690dfc47e7a35bcb3ad9878fb41fb08e`,
but the source commit was unavailable in the public repository when imported.
Avoid hand-editing its minified JavaScript or treating it as maintainable source.

## Routes

| URL | Published file |
| --- | --- |
| `/blog` | `public/blog.html` |
| `/blog/authorized-means-written` | `public/blog/authorized-means-written.html` |
| `/blog/chromium-in-the-terminal` | `public/blog/chromium-in-the-terminal.html` |
| `/blog/pack-the-repo-not-the-prompt` | `public/blog/pack-the-repo-not-the-prompt.html` |
| `/blog/zero-prompt-logging` | `public/blog/zero-prompt-logging.html` |
| `/privacy` | `public/privacy.html` |
| `/terms` | `public/terms.html` |
| Unknown route | `public/404.html` |

The corresponding `blog/index.html`, `blog/<article>/index.html`,
`privacy/index.html`, and `terms/index.html` files redirect trailing-slash URLs to
their canonical extensionless URLs. The original published host resolves those canonical URLs to the `.html`
files. `scripts/build.mjs` replaces the redirect directory indexes in `dist/`
with the full corresponding HTML pages, so ordinary static hosts and local
previews cannot get stuck in a trailing-slash redirect loop. The imported route HTML in `public/` remains unchanged. The homepage sitemap
modification date and the Tally summary in `llms.txt` are maintained separately.

The imported pages retain their original design and share the hashed JavaScript,
CSS, and fonts in `public/assets/`. Their media, icons, favicon files,
`theme-init.js`, feed, sitemap, robots file, `llms.txt`, security contact, and site
verification files are also preserved. The build copies `public/.` into `dist/`,
including hidden files. Existing logos, technology icons, avatar, and CNAME were
left untouched; missing production logo files were added.

`/terminal-fenster/` is served independently by the
`zent7x/terminal-fenster` GitHub Pages project. It remains a link, not an imported
route. The production root `index.html` and obsolete PR previews were excluded.

## Deliberate refresh

First recover the newer source project if possible. Otherwise, inspect a fresh
deployment in a temporary directory before updating any preserved artifacts:

```sh
git fetch origin gh-pages
git log -1 --format='%H %s' origin/gh-pages
production_snapshot=$(mktemp -d)
git archive origin/gh-pages | tar -x -C "$production_snapshot"
diff -qr public/assets "$production_snapshot/assets"
diff -qr public/blog "$production_snapshot/blog"
```

After reviewing the snapshot, copy the route HTML and its matching hashed assets
together. The following deliberately replaces only the preserved route groups;
it does not copy the production homepage, CNAME, avatar, or existing logo/tech
directories:

```sh
for route_group in assets blog blog.html privacy privacy.html terms terms.html \
  404.html media icons apple-touch-icon.png favicon.ico favicon-32.png \
  favicon-256.png theme-init.js feed.xml sitemap.xml robots.txt llms.txt \
  .well-known .nojekyll BingSiteAuth.xml 9f3660e2570b4bd5b9cef61f2d4e5633.txt
do
  cp -R "$production_snapshot/$route_group" public/
done
npm run build
```

Review any newly referenced logo paths separately and copy missing files without
overwriting local assets. Inspect `git diff`, verify every local HTML/CSS asset
reference, and check article, legal, and 404 pages on a server that supports
extensionless `.html` URLs. Do not delete older hashed assets until all HTML
references to them are gone. Update this document's recorded deployment revision
after a refresh.

## Preview builds

With a non-root `BASE_PATH`, the homepage assets stay under the preview prefix.
Published writing and legal pages link or redirect to production, since their
preserved JavaScript assumes root routing. All preview HTML is noindex and
CNAME is omitted. Production still receives the complete route documents.

After refreshing the production snapshot, retain the current homepage's real
modification date in `sitemap.xml` and the up-to-date project summaries in
`llms.txt`. The new `media/og-portfolio.*` assets belong to the editable homepage.
