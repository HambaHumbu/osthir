# Asset Manifest — Osthir Test

Every original asset was visually inspected (not just filename-matched) during
the build audit on 2026-10-25. Originals in the project root are **never
modified**; all derivatives live under `public/media/`.

## Photographs (all 1920×1280 JPEG unless noted)

| Original file | Verified content | Used for | Derivatives |
|---|---|---|---|
| `osthir-test-hero-table-spread.jpg` | Table spread: biryani bowl, korma, spiced tea, mango lassi on brass trays, emerald linen | Homepage "The Table", Our Story, Catering hero, OG image base | `hero-table-spread-{768,1280,1920}.{avif,webp,jpg}` |
| `osthir-test-beef-biryani.jpg` | Dark slow-cooked beef over saffron rice, fried onions, green chilli, steam | Beef Biryani card + dish page, homepage featured | `beef-biryani-{640,1080,1600}.*` |
| `osthir-test-lamb-biryani.jpg` | On-the-bone lamb biryani, saffron/carrot rice, lemon, mint | Lamb Biryani card + dish page, 404 page | `lamb-biryani-{640,1080,1600}.*` |
| `osthir-test-beef-desi.jpg` | Dark glossy beef curry with potatoes, brass bowl, coriander | Beef Desi card + dish page | `beef-desi-{640,1080,1600}.*` |
| `osthir-test-chicken-desi.jpg` | Bone-in chicken + potato curry, golden gravy, green chilli | Chicken Desi card + dish page | `chicken-desi-{640,1080,1600}.*` |
| `osthir-test-duck-desi.jpg` | Dark duck curry, whole spices (cinnamon, cardamom, dried chilli) | Duck Desi card + dish page | `duck-desi-{640,1080,1600}.*` |
| `osthir-test-chicken-korma.jpg` | Pale creamy chicken korma, almonds, fried onion, ghee drizzle | Chicken Korma card + dish page | `chicken-korma-{640,1080,1600}.*` |
| `osthir-test-lemon-tea.jpg` | Clear glass of hot tea with lemon wheel, steam | Lemon Tea card + dish page | `lemon-tea-*` |
| `osthir-test-mint-tea.jpg` | Glass of light tea full of fresh mint leaves | Mint Tea card + dish page | `mint-tea-*` |
| `osthir-test-saffron-tea.jpg` | Amber tea with visible saffron threads | Saffron Tea card + dish page | `saffron-tea-*` |
| `osthir-test-regular-lassi.jpg` | Tall chilled plain lassi, frothy spiced top, condensation | Regular Lassi card + dish page | `regular-lassi-*` |
| `osthir-test-pistachio-badam-mi.jpg` | Tall pistachio-almond milk, chopped nuts on top | Pistachio Badam Milk card + dish page | `pistachio-badam-milk-*` |
| `osthir-test-process-lassi-pour.jpg` | **Mango** lassi poured thick from brass jug, pistachio dusting, fresh mango | Mango Lassi card + dish page, Craft ch. 08 | `mango-lassi-pour-*` |
| `osthir-test-process-dum-seal.jpg` | Hands pressing dough seal onto brass handi | Craft ch. 05 | `process-dum-seal-*` |
| `osthir-test-process-fried-onio.jpg` | Crisp fried onions lifted from brass pan, oil dripping | Craft ch. 02 | `process-fried-onion-*` |
| `osthir-test-process-ghee-pour.jpg` | Ghee poured from brass cup onto steaming rice | Craft ch. 04 | `process-ghee-pour-*` |
| `osthir-test-process-mint-torn.jpg` | Hands tearing fresh mint over a green ceramic bowl | Craft ch. 06 | `process-mint-torn-*` |
| `osthir-test-process-saffron.jpg` | Saffron threads crumbled over steaming rice | Craft ch. 03, Our Story | `process-saffron-*` |
| `osthir-test-process-spice-mort.jpg` | Whole spices ground in brass mortar (cardamom, clove, cinnamon, chilli) | Craft ch. 01 | `process-spice-mortar-*` |
| `osthir-test-process-tea-pull.jpg` | Milky tea poured from a height, frothing | Craft ch. 07, Drinks interlude | `process-tea-pull-*` |

## Logo

| File | Detail | Derivatives |
|---|---|---|
| `loooogo.png` (1254×1254, no alpha, sampled background `#194220`) | Gold flame-and-bowl mark on deep green | `public/logo-192.png`, `logo-512.png`, `apple-touch-icon.png`, `favicon-32.png`, `media/img/logo-256.webp` (nav/footer roundel matching the sampled background) |

## Videos (all 1280×720 H.264, 24 fps)

| Original | Duration | Verified content | Used for | Derivative |
|---|---|---|---|---|
| `osthir-v1-hero-loop.mp4` | 10 s | Ornate brass handi, lid lifts, steam reveals saffron biryani, slow push-in | **Homepage hero** (chosen after frame review — moodiest, most emerald) | `hero-loop.mp4` (CRF 26, ~2 MB) + posters |
| `osthir-v2-brand-film.mp4` | 8 s (has mono AAC audio) | Spice/pot/tea/plating montage; **final ~1.4 s shows a non-brand calligraphy card** | Our Story hero — **trimmed to 6.6 s**, audio stripped | `brand-film.mp4` + posters |
| `osthir-v3-biryani-pot-reveal.mp4` | 10 s | Golden handi lid lifts over chicken biryani, star anise, heavy steam | The Craft page hero | `biryani-pot-reveal.mp4` + posters |
| `osthir-v4-curry-simmer.mp4` | 10 s | Chicken curry simmering in copper pot, ladle stir | The Craft mid-page | `curry-simmer.mp4` + posters |
| `osthir-v5-malai-tea-pour.mp4` | 10 s | Ornate brass jug pours steaming milky tea into a glass | Drinks page hero | `malai-tea-pour.mp4` + posters |
| `osthir-v6-lassi-pour.mp4` | 10 s | Mango lassi poured, crowned with mango cubes | Drinks page feature | `lassi-pour.mp4` + posters |

All video derivatives: audio stripped, `+faststart`, lazy-loaded below the
fold, poster-first, and replaced by the poster under `prefers-reduced-motion`.

## Design references — audit outcome

| File | Verdict |
|---|---|
| `design background idea.png` (emerald/gold leaf veins) | **Not used directly** — recreated as a pure-CSS/SVG texture (`.texture-leaf` in `src/styles/global.css`) to guarantee no watermark/licensing artifacts |
| `design background and color idea.png` (kintsugi marble) | **Not used directly** — faint circular stock-preview artifacts visible; palette/mood adopted, texture recreated in CSS |
| `design color idea and background idea .png` | **Not used** — contains embedded "LUXURY BACKGROUND" sample text; used as palette/mood reference only |

## Optimization status

- Images: AVIF + WebP + JPEG at 3–4 responsive widths each, LQIP placeholders
  embedded via `src/data/media-manifest.json`. Re-run: `npm run assets:images`.
- Videos: re-encoded H.264 CRF 26 + `faststart`, audio stripped, poster JPG/WebP
  per video. Re-run: `npm run assets:videos`.
- Fonts: Fraunces + Manrope variable woff2 self-hosted in `public/fonts/`
  (SIL OFL). Re-fetch: `node scripts/download-fonts.mjs`.
