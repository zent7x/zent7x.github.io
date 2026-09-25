# Search and sharing

The homepage is served as complete HTML. Its About, Work, Writing and Elsewhere
views are sections of one canonical page, not separate indexable fragment URLs.
All article links and descriptions exist in the initial HTML. Published writing
also has its own complete HTML at the original URLs.

## Metadata

- `index.html` owns the homepage title, description, canonical URL, social tags,
  RSS discovery, and the ProfilePage/Person/WebSite JSON-LD graph.
- The Person ID remains `https://zent7x.com/#person`, matching article authors.
  Only the public identity, bio, and linked social profiles are described.
- `public/media/og-portfolio.png` is the 1200×630 homepage share card. Its SVG
  companion contains outlined local Geist type and the site's project marks.
- `scripts/generate-social-card.py` regenerates both card files. It is optional
  authoring tooling requiring Python `fonttools`, Brotli support, `cairosvg`,
  and a system Cairo library; it is not needed for builds or deployment.
  With Homebrew Cairo on macOS, run
  `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib python3 scripts/generate-social-card.py`.
- Published article titles, images, BlogPosting/breadcrumb data, and canonical
  URLs are preserved from production. Legal and 404 pages retain noindex.
- `public/sitemap.xml` lists the canonical homepage, archive, four articles and
  the independently hosted terminal-fenster project. Change `lastmod` only when
  that page's content changes. `robots.txt` advertises the sitemap.
- Preview output receives noindex and is excluded from the production sitemap.

## Validation

`npm test` checks metadata consistency, structured-data relationships, actual
share-image dimensions, canonical article discovery, sitemap dates, complete
route output, and preview behavior. `npm run build` produces `dist/` without
client rendering or external APIs being needed for the page content.

After publishing, check the homepage, `/sitemap.xml`, `/robots.txt`, the share
image, the four article URLs, and their canonical tags. Search engines decide
when to recrawl and how to display results; these changes do not guarantee a
particular ranking. Search Console inspection/submission is a separate account
operation and is not part of the build.

## References

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: JavaScript SEO and crawlable URLs](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: sitemap creation and modification dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
