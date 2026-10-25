#!/usr/bin/env node
/**
 * Osthir Test — image optimization pipeline.
 *
 * Reads the ORIGINAL photographs and logo from the project root (never
 * modifies them) and writes responsive AVIF/WebP/JPEG derivatives to
 * public/media/img/, plus favicon/app-icon/OG derivatives to public/.
 * Writes src/data/media-manifest.json, which the <Picture> component uses
 * to emit <picture> markup with srcset/sizes and LQIP placeholders.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'media', 'img');
const MANIFEST = path.join(ROOT, 'src', 'data', 'media-manifest.json');

// name → [source file, widths to generate]
const WIDTHS = [640, 1080, 1600];
const HERO_WIDTHS = [768, 1280, 1920];

const IMAGES = {
  'hero-table-spread': ['osthir-test-hero-table-spread.jpg', HERO_WIDTHS],
  'beef-biryani': ['osthir-test-beef-biryani.jpg', WIDTHS],
  'lamb-biryani': ['osthir-test-lamb-biryani.jpg', WIDTHS],
  'beef-desi': ['osthir-test-beef-desi.jpg', WIDTHS],
  'chicken-desi': ['osthir-test-chicken-desi.jpg', WIDTHS],
  'duck-desi': ['osthir-test-duck-desi.jpg', WIDTHS],
  'chicken-korma': ['osthir-test-chicken-korma.jpg', WIDTHS],
  'lemon-tea': ['osthir-test-lemon-tea.jpg', WIDTHS],
  'mint-tea': ['osthir-test-mint-tea.jpg', WIDTHS],
  'saffron-tea': ['osthir-test-saffron-tea.jpg', WIDTHS],
  'regular-lassi': ['osthir-test-regular-lassi.jpg', WIDTHS],
  'pistachio-badam-milk': ['osthir-test-pistachio-badam-mi.jpg', WIDTHS],
  'mango-lassi-pour': ['osthir-test-process-lassi-pour.jpg', WIDTHS],
  'process-dum-seal': ['osthir-test-process-dum-seal.jpg', WIDTHS],
  'process-fried-onion': ['osthir-test-process-fried-onio.jpg', WIDTHS],
  'process-ghee-pour': ['osthir-test-process-ghee-pour.jpg', WIDTHS],
  'process-mint-torn': ['osthir-test-process-mint-torn.jpg', WIDTHS],
  'process-saffron': ['osthir-test-process-saffron.jpg', WIDTHS],
  'process-spice-mortar': ['osthir-test-process-spice-mort.jpg', WIDTHS],
  'process-tea-pull': ['osthir-test-process-tea-pull.jpg', WIDTHS],
};

const LOGO_SRC = 'loooogo.png';

async function lqip(img) {
  const buf = await img
    .clone()
    .resize(20, null, { fit: 'inside' })
    .blur(2)
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};

  for (const [name, [src, widths]] of Object.entries(IMAGES)) {
    const srcPath = path.join(ROOT, src);
    const img = sharp(srcPath);
    const meta = await img.metadata();
    const usable = widths.filter((w) => w <= (meta.width ?? 0));
    const entry = {
      src,
      width: meta.width,
      height: meta.height,
      aspect: +(meta.width / meta.height).toFixed(4),
      widths: usable,
      placeholder: await lqip(img),
    };
    for (const w of usable) {
      const resized = img.clone().resize(w);
      await resized.clone().avif({ quality: 55, effort: 4 }).toFile(path.join(OUT, `${name}-${w}.avif`));
      await resized.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`));
      await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${name}-${w}.jpg`));
    }
    manifest[name] = entry;
    console.log(`img  ${name}: ${usable.length} sizes × 3 formats`);
  }

  // --- Logo derivatives (original logo file is never modified) ---
  const logo = sharp(path.join(ROOT, LOGO_SRC));
  const logoMeta = await logo.metadata();
  const { data: corner } = await logo
    .clone()
    .extract({ left: 0, top: 0, width: 8, height: 8 })
    .stats()
    .then((s) => ({ data: s.channels }));
  const bg = {
    r: Math.round(corner[0].mean),
    g: Math.round(corner[1].mean),
    b: Math.round(corner[2].mean),
  };
  manifest['logo'] = {
    src: LOGO_SRC,
    width: logoMeta.width,
    height: logoMeta.height,
    aspect: +((logoMeta.width / logoMeta.height).toFixed(4)),
    hasAlpha: logoMeta.hasAlpha ?? false,
    background: `#${[bg.r, bg.g, bg.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`,
  };
  for (const size of [192, 512]) {
    await logo.clone().resize(size, size).png().toFile(path.join(ROOT, 'public', `logo-${size}.png`));
  }
  await logo.clone().resize(180, 180).png().toFile(path.join(ROOT, 'public', 'apple-touch-icon.png'));
  await logo.clone().resize(32, 32).png().toFile(path.join(ROOT, 'public', 'favicon-32.png'));
  // favicon.ico as a PNG-in-ICO container (valid for all modern browsers)
  const icoPng = await logo.clone().resize(32, 32).png().toBuffer();
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // type: icon
  icoHeader.writeUInt16LE(1, 4); // count
  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0); // width
  icoEntry.writeUInt8(32, 1); // height
  icoEntry.writeUInt8(0, 2); // palette
  icoEntry.writeUInt8(0, 3); // reserved
  icoEntry.writeUInt16LE(1, 4); // planes
  icoEntry.writeUInt16LE(32, 6); // bpp
  icoEntry.writeUInt32LE(icoPng.length, 8); // size
  icoEntry.writeUInt32LE(22, 12); // offset
  await writeFile(path.join(ROOT, 'public', 'favicon.ico'), Buffer.concat([icoHeader, icoEntry, icoPng]));
  console.log('favicon.ico written');
  // Small nav-friendly version used inside a matching-color roundel.
  await logo.clone().resize(256, 256).webp({ quality: 85 }).toFile(path.join(OUT, 'logo-256.webp'));
  console.log(`logo background sampled: ${manifest.logo.background}, alpha=${manifest.logo.hasAlpha}`);

  // --- Social / Open Graph share image (1200×630) ---
  const ogBase = await sharp(path.join(ROOT, 'osthir-test-hero-table-spread.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await sharp(ogBase)
    .composite([
      {
        input: await logo.clone().resize(150, 150).png().toBuffer(),
        blend: 'over',
        top: 56,
        left: 525,
      },
    ])
    .flatten({ background: manifest.logo.background })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ROOT, 'public', 'og-image.jpg'));
  console.log('og-image.jpg written (1200×630)');

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  const total = (await stat(MANIFEST)).size;
  console.log(`manifest written: ${path.relative(ROOT, MANIFEST)} (${total} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
