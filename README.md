# Toti Video — Efraim Toti's portfolio

A static site with no build step. A drawn video store: the storefront at night, then shelves of tapes you can open. All artwork is painted by JavaScript on canvas — there are no image files.

## Files
- `index.html`, `style.css` — page shell and the text overlays
- `data.js` — **all the content**: one entry per tape (title, genre, tagline, blurb, works, links)
- `covers.js` — the cover paintings, one function per genre
- `main.js` — the storefront, the walk-in, the sliding room and the opened-tape view


## Preview on your computer
Double-click `index.html`. It opens straight from the folder; no server is needed.

## Deploy on GitHub Pages
1. Create a repository and upload every file in this folder to its root (including `.nojekyll`).
2. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/` after a minute or two.
