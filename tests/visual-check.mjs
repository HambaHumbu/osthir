#!/usr/bin/env node
/**
 * Visual + interaction verification with Playwright.
 * Serves dist/ itself (tiny static server), then:
 *   - visits every route at desktop (1440×900), captures console/page errors
 *   - screenshots key pages at desktop and mobile (390×844) into .shots/
 *   - exercises menu search + filters, mobile drawer, contact form validation,
 *     and reduced-motion behavior
 * Exits non-zero on console errors or failed interactions.
 * Run: npm run build && node tests/visual-check.mjs
 */
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.join(process.cwd(), 'dist');
const SHOTS = path.join(process.cwd(), '.shots');
const PORT = 4899;
// Subpath builds (BASE_PATH=/osthir npm run build) are served under that
// prefix so the crawl is realistic; requests without the prefix 404, which
// surfaces any base-less URL the refactor missed.
const BASE = (process.env.BASE_PATH || '/').replace(/\/+$/, '');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml' };

const server = http.createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file;
    if (BASE && !urlPath.startsWith(BASE + '/')) {
      file = path.join(DIST, '__missing__'); // outside the base → 404
    } else {
      if (BASE) urlPath = urlPath.slice(BASE.length) || '/';
      file = path.join(DIST, urlPath);
      if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html');
    }
    if (!(await stat(file).catch(() => null))) {
      const notFound = path.join(DIST, '404.html');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(await readFile(notFound));
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
});

const pages = ['/', '/menu/', '/menu/beef-biryani/', '/menu/mango-lassi/', '/drinks/', '/the-craft/', '/our-story/', '/locations/', '/catering/', '/contact/', '/privacy/', '/accessibility/'].map((p) => BASE + p);
let failures = 0;
const fail = (m) => { failures++; console.error(`  ✗ ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);

await mkdir(SHOTS, { recursive: true });
await new Promise((r) => server.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const errors = [];

try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()} @ ${msg.location()?.url ?? '?'}`); });
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('/no-such-page/')) errors.push(`http ${r.status()}: ${r.url()}`); });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

  console.log('- route render (desktop)');
  for (const p of pages) {
    const res = await page.goto(base + p, { waitUntil: 'networkidle' });
    if (res.status() !== 200) fail(`${p}: HTTP ${res.status()}`);
    else ok(`${p} renders`);
  }

  console.log('- 404 handling');
  const res404 = await page.goto(`${base}${BASE}/no-such-page/`);
  const notFoundText = await page.textContent('h1');
  if (res404.status() !== 404) fail(`404 route returned HTTP ${res404.status()}`);
  else if (!/Off the Menu/i.test(notFoundText ?? '')) fail('404 page content missing');
  else ok('unknown URL → custom 404 with HTTP 404');

  console.log('- screenshots (desktop)');
  for (const [name, p] of [['home', '/'], ['menu', '/menu/'], ['dish', '/menu/beef-biryani/'], ['drinks', '/drinks/'], ['craft', '/the-craft/'], ['story', '/our-story/'], ['locations', '/locations/'], ['contact', '/contact/']]) {
    await page.goto(base + BASE + p, { waitUntil: 'networkidle' });
    // scroll through the page so scroll-reveal elements become visible
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 260));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(SHOTS, `desktop-${name}.png`), fullPage: name !== 'home' });
  }
  ok('desktop screenshots captured');

  console.log('- menu search & filters');
  await page.goto(`${base}${BASE}/menu/`, { waitUntil: 'networkidle' });
  await page.fill('[data-menu-search]', 'korma');
  await page.waitForTimeout(200);
  let visible = await page.locator('[data-card]:visible').count();
  if (visible !== 1) fail(`search "korma" showed ${visible} cards, expected 1`);
  else ok('menu search filters correctly');
  await page.fill('[data-menu-search]', '');
  await page.click('[data-category="drinks"]');
  await page.waitForTimeout(200);
  visible = await page.locator('[data-card]:visible').count();
  if (visible !== 6) fail(`drinks filter showed ${visible} cards, expected 6`);
  else ok('category filter works');
  await page.fill('[data-menu-search]', 'zzzz');
  await page.waitForTimeout(200);
  if (!(await page.locator('[data-menu-empty]').isVisible())) fail('empty state not shown for no matches');
  else ok('empty state appears for no matches');

  console.log('- form validation (honest states)');
  await page.goto(`${base}${BASE}/contact/`, { waitUntil: 'networkidle' });
  await page.click('#contact-form [data-submit]');
  await page.waitForTimeout(200);
  const errCount = await page.locator('#contact-form [aria-invalid="true"]').count();
  if (errCount < 3) fail(`expected ≥3 invalid fields, got ${errCount}`);
  else ok('empty submit flags invalid fields');
  const statusText = await page.locator('#contact-form [data-status]').textContent();
  if (!/fix the highlighted/i.test(statusText ?? '')) fail('no accessible error status shown');
  else ok('error status announced');
  await page.fill('#contact-form-name', 'Test Person');
  await page.fill('#contact-form-email', 'test@example.com');
  await page.fill('#contact-form-message', 'This is a validation test message.');
  await page.click('#contact-form [data-submit]');
  await page.waitForTimeout(300);
  const finalStatus = await page.locator('#contact-form [data-status]').textContent();
  if (/sent|thank you, your enquiry has been sent/i.test(finalStatus ?? '') && !/not connected|email app/i.test(finalStatus ?? '')) {
    fail('form claimed delivery without an endpoint configured');
  } else ok(`honest non-connected state shown: "${(finalStatus ?? '').slice(0, 60)}…"`);

  await ctx.close();

  console.log('- mobile (390×844)');
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const mpage = await mctx.newPage();
  mpage.on('console', (msg) => { if (msg.type() === 'error') errors.push(`mobile console: ${msg.text()} @ ${msg.location()?.url ?? '?'}`); });
  mpage.on('response', (r) => { if (r.status() >= 400) errors.push(`mobile http ${r.status()}: ${r.url()}`); });
  mpage.on('pageerror', (err) => errors.push(`mobile pageerror: ${err.message}`));
  await mpage.goto(`${base}${BASE}/`, { waitUntil: 'networkidle' });
  await mpage.waitForTimeout(700);
  const overflowX = await mpage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflowX) fail('home page has horizontal overflow at 390px');
  else ok('no horizontal overflow at 390px');
  await mpage.screenshot({ path: path.join(SHOTS, 'mobile-home.png') });

  // drawer
  await mpage.click('.nav__toggle');
  await mpage.waitForTimeout(500);
  if (!(await mpage.locator('#nav-drawer.is-open').isVisible())) fail('mobile drawer did not open');
  else ok('mobile drawer opens');
  await mpage.screenshot({ path: path.join(SHOTS, 'mobile-drawer.png') });
  await mpage.keyboard.press('Escape');
  await mpage.waitForTimeout(500);
  if (await mpage.locator('#nav-drawer.is-open').isVisible().catch(() => false)) fail('drawer did not close on Escape');
  else ok('drawer closes on Escape');

  await mpage.goto(`${base}${BASE}/menu/`, { waitUntil: 'networkidle' });
  await mpage.screenshot({ path: path.join(SHOTS, 'mobile-menu.png'), fullPage: false });
  const menuOverflow = await mpage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (menuOverflow) fail('menu page has horizontal overflow at 390px');
  await mctx.close();

  console.log('- reduced motion');
  const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rpage = await rctx.newPage();
  rpage.on('response', (r) => { if (r.status() >= 400) errors.push(`reduced http ${r.status()}: ${r.url()}`); });
  await rpage.goto(`${base}${BASE}/`, { waitUntil: 'networkidle' });
  await rpage.waitForTimeout(800);
  const heroVideoSrc = await rpage.evaluate(() => document.querySelector('.hero video')?.getAttribute('src'));
  if (heroVideoSrc) fail('hero video loaded under reduced motion (should be poster only)');
  else ok('hero video not loaded under reduced motion (poster only)');
  const revealed = await rpage.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every((el) => getComputedStyle(el).opacity === '1'));
  if (!revealed) fail('revealed content hidden under reduced motion');
  else ok('all content visible under reduced motion');
  await rctx.close();
} finally {
  await browser.close();
  server.close();
}

const unexpectedErrors = errors.filter((e) => !e.includes('/no-such-page/'));
if (unexpectedErrors.length) {
  unexpectedErrors.forEach((e) => fail(e));
}
if (failures) {
  console.error(`\n${failures} problem(s). Visual/interaction check FAILED.`);
  process.exit(1);
}
console.log('\nVisual & interaction check PASSED.');
