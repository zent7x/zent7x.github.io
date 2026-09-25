# Portfolio marks · version 2

Seven original vector drawings for the portfolio, on a 24-unit grid with
one consistent 2-unit rounded stroke and transparent backgrounds. The earlier
marks remain in the parent directory.

| Mark | Drawing | Charcoal theme | White theme |
| --- | --- | --- | --- |
| warm.run | A soft W with rising, curved sides | `#E4AE79` | `#9A5A28` |
| routing.run | One flowing path with two directional exits | `#B8A4E8` | `#7052A8` |
| terminal-fenster | A rounded window, prompt, and short cursor | `#82B9D4` | `#356E8A` |
| grasp | A short context fragment held between two brackets | `#DBA5B9` | `#A35373` |
| cogrep | Paired search lenses sharing a matching region | `#BCC987` | `#617024` |
| codemap | Three open, connected map folds | `#B8A4E8` | `#7052A8` |
| tally | Four upright counts crossed by a fifth stroke | `#E4AE79` | `#9A5A28` |

The refinement keeps the existing palette and concepts. Warm's three separate
heat strokes now connect into a recognizable initial. Routing's square nodes
become arrowheads so the branch has a clear direction. Grasp's solid diamond
becomes a readable fragment, with space between the lines and brackets. Cogrep's
lenses and handle sit farther inside the canvas so they have the same visual
weight as the other marks. Terminal, codemap, and tally use simpler proportions
and the same stroke weight.

The drawings are intended for 20px inline links and 32px project rows. Their
visible strokes stay inside the 24-unit canvas with at least 2 units of edge
space. Keep their natural proportions; do not add backgrounds, gradients,
shadows, or an extra outline.

Each named SVG works as a standalone asset. `marks.svg` contains the same
drawings as reusable symbols, referenced by the homepage with SVG `use`.
The symbols inherit `currentColor`, so the same source supports both themes.
Standalone SVGs default to the charcoal-theme color. Each symbol's drawing
elements and attributes exactly match the corresponding standalone SVG; only
the outer wrapper and standalone default color differ. When changing a drawing,
update its matching symbol and compare the parsed XML geometry as well.

Rust and TypeScript retain their existing recognizable shapes. Their website
colors are silver and muted teal, with darker equivalents in the white theme.
External company and game marks retain their existing artwork.
