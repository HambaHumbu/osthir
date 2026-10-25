#!/usr/bin/env node
/**
 * Downloads the Fraunces variable display font (SIL Open Font License) from
 * Google Fonts into public/fonts/. Run once (or to refresh):
 *
 *   node scripts/download-fonts.mjs
 *
 * The body/UI font is Rany (rany-regular/medium/bold.woff2). Rany is not on
 * Google Fonts, so it is vendored: the OTF source was converted to WOFF2 with
 * fonttools and committed directly. It is not fetched by this script.
 *
 * The @font-face rules for all of these files are NOT generated here, they
 * live as an inline, base-path-aware <style> block in
 * src/layouts/BaseLayout.astro (bundled CSS cannot prefix public-dir url()s
 * with the configured base). If font files are ever renamed, update that block.
 *
 * The built site never contacts a third-party font server at runtime.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FAMILIES = [
  {
    css: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap',
    file: 'fraunces-var.woff2',
    family: 'Fraunces',
    // keep only the latin variable file
  },
];

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function main() {
  const dir = path.join(process.cwd(), 'public', 'fonts');
  await mkdir(dir, { recursive: true });

  for (const fam of FAMILIES) {
    const res = await fetch(fam.css, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`font css fetch failed: ${res.status}`);
    const css = await res.text();
    // Pick the /* latin */ variable-font block's woff2 URL.
    const latinBlock = css.split('/* latin */')[1];
    if (!latinBlock) throw new Error(`no latin block for ${fam.family}`);
    const url = latinBlock.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    if (!url) throw new Error(`no woff2 url for ${fam.family}`);
    const fontRes = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!fontRes.ok) throw new Error(`font download failed: ${fontRes.status}`);
    const buf = Buffer.from(await fontRes.arrayBuffer());
    await writeFile(path.join(dir, fam.file), buf);
    console.log(`font ${fam.family}: ${buf.length} bytes → public/fonts/${fam.file}`);
  }

  console.log('Done. @font-face rules live in src/layouts/BaseLayout.astro, no CSS file is generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
