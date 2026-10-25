# Osthir Test — Restaurant Website

A complete, static, multi-page restaurant website for **Osthir Test** — premium
fast-casual biryani, desi comfort food and traditional drinks, in an
emerald-and-gold editorial design.

Built with **Astro 5** (static output) and **plain JavaScript** — no TypeScript,
no React, no runtime framework lock-in, no database, no external services
required to display the site.

---

## 1. Prerequisites

- **Node.js 20+** (built and tested on Node 26)
- **npm** (comes with Node)
- That's it. Image processing uses the npm package `sharp`; video processing
  uses the npm package `ffmpeg-static` (a bundled FFmpeg binary). No system
  FFmpeg, ImageMagick, or other tools are needed.

## 2. Installation

```bash
npm install
```

## 3. Development

```bash
npm run dev        # start the dev server → http://localhost:4321
```

To preview on your local network (e.g. from your phone):

```bash
npm run dev -- --host
```

then open the `Network:` URL Astro prints. **Caution:** the dev server is a
development tool — bind it only on a trusted local network, never expose it
to the public internet.

## 4. Production build

```bash
npm run build      # outputs the static site to dist/
```

## 5. Local production preview

```bash
npm run preview    # serves dist/ at http://localhost:4321
```

## 6. Editing menu items and business information

- **Business info** (name, tagline, contact, address, hours, social links,
  currency, ordering URL, form endpoint): edit **`src/config/site.js`**.
  Every field is commented. Fields left `null` are simply not shown — the site
  never displays fabricated contact details, hours, or prices.
- **Menu items, categories, descriptions, prices**: edit **`src/data/menu.js`**.
  Each dish has `slug`, `name`, `category`, `image`, `alt`, `short`,
  `description`, `notes`, `price` and `featured`. Set `price` to a number to
  display it (formatted with the currency from `src/config/site.js`).
- **Craft chapters** (`/the-craft/`): edit **`src/data/craft.js`**.

## 7. Replacing or adding photos and videos

The **original files in the project root are never modified** by any script.

- Photos: drop a replacement over the original file (same filename) or add a
  new file, register it in `scripts/optimize-images.mjs` (`IMAGES` map) and in
  `src/data/menu.js` (`image:` key), then re-run:

  ```bash
  npm run assets:images
  ```

- Videos: replace or add originals, register them in
  `scripts/optimize-videos.mjs` (`VIDEOS` map), then:

  ```bash
  npm run assets:videos
  ```

These regenerate the responsive AVIF/WebP/JPEG derivatives, video encodes and
posters under `public/media/`, plus `src/data/media-manifest.json`.

## 8. Configuring the ordering URL

In `src/config/site.js`:

```js
orderingUrl: 'https://your-ordering-provider.com/osthir-test',
```

Every "Order" button site-wide uses this one value. While it is `null`, order
buttons honestly route to `/menu/` and the site says ordering is not connected.

## 9. Adding the real public domain

Create a `.env` file (or edit the fallback in `src/config/site-url.mjs`):

```bash
echo 'SITE_URL=https://www.your-real-domain.com' > .env
npm run build
```

Canonical URLs, Open Graph URLs, `robots.txt` and `sitemap-index.xml` all pick
this up. The build prints a warning while the placeholder is still in use.
**Do this before submitting the site to search engines.**

## 10. Configuring contact / catering forms

In `src/config/site.js`:

- **Best:** set `forms.formEndpoint` to a form backend you control
  (e.g. Formspree, Getform, or your own endpoint). Forms POST JSON via `fetch`
  and show the real result.
- **Fallback:** set `contact.email`. Forms then open the visitor's email app
  with a pre-filled draft addressed to you.
- **Neither:** forms validate accessibly but state clearly that online
  enquiries are not connected. The site *never* shows a fake success message.

## 11. Hosting the site from your own device

The build is plain static files in `dist/`. Any static file server works:

```bash
npm run build
npx serve dist            # or: python3 -m http.server -d dist 8080
```

To share on your local network, note your LAN IP (`ipconfig getifaddr en0`)
and serve with a tool that binds to `0.0.0.0`, e.g.:

```bash
npx serve dist -l tcp://0.0.0.0:8080
```

For real public hosting, upload `dist/` to any static host (or a web server
such as nginx/Caddy on your own machine behind your domain). No server-side
runtime is required.

## 12. Details that still require real business information

All surfaced by `npm run check` as warnings:

- **SITE_URL** — the real public domain (§9)
- **orderingUrl** — the real ordering provider link (§8)
- **contact.email / phone** — published nowhere until configured
- **location.\*** — address, hours, directions, map embed; the Locations page
  shows an honest "being confirmed" state until then
- **forms.formEndpoint** — where enquiries are delivered (§10)
- **Prices, allergens, dietary certifications** — intentionally absent until
  you add verified values in `src/data/menu.js`
- **Social profile URLs** — rendered only when real URLs are supplied

## 13. Re-running asset optimization and tests

```bash
npm run assets          # re-generate all image + video derivatives
npm run check           # source-level data/config verification
npm run lint            # syntax-check scripts + validate JSON
npm test                # crawl dist/ — links, assets, meta, JSON-LD
npm run verify          # build + post-build verification in one step
```

---

## Project structure

```
src/
  config/        central business config + site URL
  data/          menu items, craft chapters, generated media manifest
  lib/           SEO/JSON-LD, media, ordering helpers (plain JS)
  layouts/       BaseLayout (head, header, footer, scripts)
  components/    Header, Footer, Picture, VideoBlock, FoodCard, forms, FAQ…
  pages/         routes: /, /menu/, /menu/[slug]/, /drinks/, /the-craft/,
                 /our-story/, /locations/, /catering/, /contact/,
                 /privacy/, /accessibility/, /404/, robots.txt, llms.txt…
  styles/        design tokens + global CSS (fonts.css is generated)
public/
  fonts/         self-hosted Fraunces + Manrope woff2 (SIL OFL)
  media/         generated responsive images, video encodes, posters
  *.png, og-image.jpg   favicons, app icons, social share image
scripts/         asset pipelines (images, videos, fonts)
tests/           source check, build crawler, lint
```

## Notes

- All fonts, images and videos are served locally — no runtime CDN, analytics,
  or third-party calls.
- `prefers-reduced-motion` is respected throughout: decorative videos are
  replaced by poster stills and scroll animations are disabled.
- `llms.txt` is provided as a supplementary plain-text site guide; it does not
  replace the crawlable HTML and JSON-LD the site is built on.
