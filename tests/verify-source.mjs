#!/usr/bin/env node
/**
 * Source-level checks (npm run check):
 *   1. Menu data integrity, unique slugs, valid categories, every image key
 *      exists in the generated media manifest, alt text present.
 *   2. Every menu item has a matching generated derivative on disk.
 *   3. Expected pages, fonts and the logo derivative exist.
 *   4. Config sanity, warns (does not fail) when SITE_URL / contact / ordering
 *      are still unconfigured, so the check passes pre-launch but tells the truth.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { menuItems, categories } from '../src/data/menu.js';
import site from '../src/config/site.js';

const ROOT = process.cwd();
let failures = 0;
const warnings = [];

function fail(msg) {
  failures++;
  console.error(`  ✗ ${msg}`);
}
function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

console.log('Source checks\n- data integrity');
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'src/data/media-manifest.json'), 'utf8'));

const slugs = new Set();
for (const item of menuItems) {
  if (slugs.has(item.slug)) fail(`duplicate menu slug: ${item.slug}`);
  slugs.add(item.slug);
  if (!categories.some((c) => c.id === item.category)) fail(`${item.slug}: unknown category "${item.category}"`);
  if (!item.alt || item.alt.length < 20) fail(`${item.slug}: missing/short alt text`);
  if (!manifest[item.image]) fail(`${item.slug}: image "${item.image}" missing from media manifest`);
  else {
    for (const w of manifest[item.image].widths) {
      const p = path.join(ROOT, 'public/media/img', `${item.image}-${w}.webp`);
      if (!existsSync(p)) fail(`${item.slug}: missing derivative ${item.image}-${w}.webp`);
    }
  }
}
ok(`${menuItems.length} menu items verified against media manifest`);

console.log('- required files');
const required = [
  'src/pages/index.astro',
  'src/pages/menu/index.astro',
  'src/pages/menu/[slug].astro',
  'src/pages/drinks.astro',
  'src/pages/our-story.astro',
  'src/pages/the-craft.astro',
  'src/pages/locations.astro',
  'src/pages/catering.astro',
  'src/pages/contact.astro',
  'src/pages/privacy.astro',
  'src/pages/accessibility.astro',
  'src/pages/404.astro',
  'public/fonts/fraunces-var.woff2',
  'public/fonts/rany-regular.woff2',
  'public/fonts/rany-medium.woff2',
  'public/fonts/rany-bold.woff2',
  'public/media/img/logo-256.webp',
  'public/og-image.jpg',
  'public/media/video/hero-loop.mp4',
  'public/media/video/hero-loop-poster.jpg',
];
for (const f of required) {
  if (!existsSync(path.join(ROOT, f))) fail(`missing: ${f}`);
}
ok(`${required.length} required files present`);

console.log('- configuration');
if (site.url.includes('example.com')) warnings.push('SITE_URL is still the placeholder, set it before public launch (README §9).');
if (!site.orderingUrl) warnings.push('orderingUrl not set, order buttons route to /menu/ (README §8).');
if (!site.contact.email && !site.contact.phone) warnings.push('No contact email/phone configured (README §6).');
if (!site.location.addressLines) warnings.push('No address/hours configured, Locations page shows honest "being confirmed" state (README §6).');
if (!site.forms.formEndpoint) warnings.push('forms.formEndpoint not set, forms fall back to mailto/info states (README §10).');
warnings.forEach((w) => console.warn(`  ⚠ ${w}`));

if (failures) {
  console.error(`\n${failures} problem(s) found. Source check FAILED.`);
  process.exit(1);
}
console.log(`\nSource check PASSED${warnings.length ? ` (${warnings.length} configuration note(s) above)` : ''}.`);
