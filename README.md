# Toti Video — Efraim Toti's portfolio

A static site: no build step, no dependencies. All artwork (storefront, tape covers, VHS noise, barcode, favicon) is drawn with JavaScript on canvas.

## Edit the content
Everything on the shelves lives in `data.js`. Add a tape by copying an entry and changing its fields. Photos go in a `photos/` folder and are listed under `photos` in the same file.

## Deploy on GitHub Pages
1. Create a repository and upload every file in this folder to its root (including `.nojekyll`).
2. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/` after a minute or two.
