# zent7x.com

Personal site for [Adeeb Bashir / zentex](https://zent7x.com).
A compact, text-first portfolio with charcoal and white themes.

```bash
npm run dev      # builds and serves locally; use the printed URL
npm run build    # generates dist/
npm test         # validates routes, SEO, previews, chess, and contribution dates
npm run preview  # serves the existing dist/ build
```

The editable homepage is static HTML: `index.html`, `public/portfolio.css`,
and `site.js`. It has About, Work, Writing, and Elsewhere views with hash-based
navigation above the content. All content remains visible without JavaScript.
The theme choice persists locally; the header search button, Cmd/Ctrl+K, or
“Find something” opens the command palette. The homepage includes the latest
article and inline brand links with theme-aware colors. Seven original project
marks form the second SVG set in `public/logos/v2/`, shared by About and Work.
See [the logo notes](public/logos/v2/README.md) for the palette and asset layout.
Search includes project names, article titles, and their descriptions, and opens
project details even when a category filter would otherwise hide them. Contact
offers both a mail link and a copy-email action with visible feedback.

Work has category filters and expandable project notes. Writing has estimated
reading times and a reading list saved in localStorage on the visitor’s device.
Elsewhere has linked games, a grouped technology list with logos, and three
mate-in-one chess puzzles with mouse and keyboard controls. Chess rules run
locally using a vendored, BSD-licensed chess.js module;
the puzzles do not call an external service. The footer shows the current time
in Kashmir. These enhancements live in `public/extras.js`, `extras.css`,
`chess.js`, and `chess.css`.

Game icons are stored locally in `public/logos/`: the Chess knight is an original
vector, [Valorant](https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/valorant.svg)
comes from Simple Icons, [Elden Ring](https://shared.fastly.steamstatic.com/community_assets/images/apps/1245620/b6e290dd5a92ce98f89089a207733c70c41a1871.jpg)
uses its official Steam app icon, and [Balatro](https://www.playbalatro.com/favicon-32x32.png)
uses the official website icon. The monochrome [TypeScript mark](https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/typescript.svg)
also comes from Simple Icons. Brand marks belong to their respective owners.

Published articles and legal pages are retained from the current production
site. See [PRODUCTION-ROUTES.md](PRODUCTION-ROUTES.md) for their provenance and
refresh process. The build copies assets and materializes directory indexes for
those routes so they work on ordinary static hosts.

The domain is `zent7x.com`. Pushing `main` runs tests and the static build,
then publishes `dist/` to the `gh-pages` branch through the existing deployment
workflow. The domain, search-verification files, published articles, and project
sites remain in place. Legacy files under `src/` and `prerender.mjs` are retained
for history and are not part of the active static build.

PR previews support `BASE_PATH=/pr-preview/pr-N/`. They preview the homepage,
its navigation and interactions; writing and legal links open the production
pages because their preserved JavaScript assumes the site root. Preview HTML
is marked `noindex`, and preview output omits CNAME.

Homepage SEO includes a descriptive title, canonical URL, Open Graph/Twitter
cards, RSS discovery, and linked ProfilePage, Person, and WebSite structured
data. The sitemap keeps the original article modification dates. See
[SEO.md](SEO.md) for validation and maintenance notes.
