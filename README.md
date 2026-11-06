# Columbia Blue — Campus Basemap

A quiet, flat basemap for Morningside, Manhattanville and Columbia University Irving Medical Center. Built by **Ci Song** for GIS for Design Practices, Tutorial 8.1.

GitHub username: **Cisanotheraccount**.

Website: **https://cisanotheraccount.github.io/columbia-blue-basemap/**

Drag or zoom the map, switch between the three campus views and the overview, save a PNG, or download the editable map style. This is a basemap study; classroom search, indoor positioning and route navigation are not included.

## Course deliverables

[Tutorial 8.1](https://designpractices.org/tutorials/08-interactive-mapping-part-1/) asks for the GitHub username and a `style.json` file submitted to Canvas. The public website is a reusable preview for subsequent web-mapping work; it does not replace the Canvas submission.

The `style.json` in this repository is the reviewed Maputnik style, preserved without alteration. It can be opened in [Maputnik](https://maplibre.org/maputnik/) to adjust the layers, colors and labels.

## Design and data

- Buildings use Columbia Blue `#B9D9EB`; primary text uses `#1D4F91`, following the [Columbia University color reference](https://visualidentity.columbia.edu/content/color).
- The base style is [OpenFreeMap Liberty](https://tiles.openfreemap.org/styles/liberty), with muted land and water, flat buildings, fewer commercial labels and retained campus and transit information.
- Map data and imagery resources are supplied by [OpenFreeMap](https://openfreemap.org/), using [OpenMapTiles](https://openmaptiles.org/) and [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Attribution remains visible and is included in saved images.
- MapLibre GL JS **5.24.0** is vendored in `assets/`; its BSD license is included as `assets/MapLibre-LICENSE.txt`.

Map coverage reflects the provider's data. A building or path shown here does not establish classroom location, access permission, opening hours or accessibility.

## Hosting

This is a buildless static site for GitHub Pages. Publish the repository root. The `.nojekyll` file disables Jekyll processing. All application assets use relative paths so the site works at a repository subpath.

No API key, backend, account login, analytics or form submission is required. An internet connection is needed for the external map tiles, glyphs and sprites. The image download runs in the browser.

November 2026
