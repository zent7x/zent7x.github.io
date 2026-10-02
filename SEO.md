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
- The visible introduction names Adeeb Bashir, the alias zentex, and the handle
  zent7x. Profile links also use `rel="me"`. Keep these identifiers consistent
  when updating the introduction or external profiles.
- The anime avatar is decorative. Do not describe it as a portrait in Person
  structured data. Add `image` only when an actual, publicly usable profile
  photo is available and is shown on the page.
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

## Name searches and AI answers

The immediate target queries are `Adeeb Bashir`, `Who is Adeeb Bashir?`,
`zentex`, `Who is zentex?`, and `zent7x`. The unqualified alias also belongs to
unrelated businesses, so measure it separately from the full name and handle.
The introduction gives visitors a clear identity and public work they can
verify. It is not a guarantee that a search engine will select the page.

After deploying the homepage changes:

1. Verify the `zent7x.com` property in Google Search Console, if it is not
   already verified. Inspect `https://zent7x.com/`, check Google's selected
   canonical and indexing status, run the live test, and request indexing.
2. Submit `https://zent7x.com/sitemap.xml` in Search Console. Repeated indexing
   requests do not accelerate crawling. Google says recrawling can take a few
   days to a few weeks and does not guarantee inclusion or ranking.
3. On the owner's public profiles, use `Adeeb Bashir` as the name and describe
   the alias and handle in the bio, for example: `Adeeb Bashir, also known as
   zentex (@zent7x). Founder and security researcher in Kashmir, India. Building
   warm.run and routing.run.` Link back to `https://zent7x.com/`.
   Confirm LinkedIn's actual display name before changing anything: its
   existing URL contains `adeeb-ahmad`, which alone does not prove that its
   display name is different. These are separate account edits.
4. Where appropriate, add a factual founder or creator credit on the product
   sites and project READMEs, with a link to this profile. Existing third-party
   coverage or an authorized public acknowledgement of work can also help
   readers verify the biography. Do not invent endorsements or buy mentions.
5. Record a baseline in Search Console's Search performance report for the
   target queries. Compare impressions, clicks, and average position after
   Google recrawls. A screenshot from one search is useful context, but cannot
   establish a universal position across locations and users.

Google's AI Overviews and AI Mode use the same SEO foundations. An eligible
supporting page must be indexed and allowed to display a snippet. AI Overviews
do not appear for every query; there is no special AI schema or text file that
forces an answer. The existing `llms.txt` is optional and is not a Google
Search requirement. Other assistants must be checked separately; this work
does not control their model knowledge or generated responses.

## References

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: JavaScript SEO and crawlable URLs](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: sitemap creation and modification dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: request a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: Search Console performance report](https://support.google.com/webmasters/answer/7576553)
