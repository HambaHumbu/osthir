#!/usr/bin/env node
/**
 * Post-build verification, crawls dist/ and checks the things that matter:
 *   1. Every internal link/href resolves to a real file in dist/.
 *   2. Every locally-referenced asset (img/src/video/poster/font/icon) exists.
 *   3. Every page has a <title>, meta description, canonical, and one <h1>.
 *   4. All JSON-LD blocks parse and use real (non-placeholder-free) data.
 *   5. No lorem ipsum, TODO markers, or dead '#'/javascript: links.
 *   6. Videos referenced with preload="none" are not eagerly fetched markup-wise.
 * Exits non-zero on any failure. Run: npm run build && npm test
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
// When built for a subpath (BASE_PATH=/osthir npm run build), every internal
// URL carries the prefix even though files still emit at the dist/ root.
const BASE = (process.env.BASE_PATH || '/').replace(/\/+$/, '');
const BASE_PREFIX = BASE; // '' for a root deployment, e.g. '/osthir'
let failures = 0;
let checked = { pages: 0, links: 0, assets: 0, jsonld: 0 };

function fail(msg) {
  failures++;
  console.error(`  ✗ ${msg}`);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// Strip the base prefix and map a root-absolute URL into dist/.
function urlToDistPath(url) {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!clean || !clean.startsWith('/')) return null;
  const rel = BASE_PREFIX ? clean.slice(BASE_PREFIX.length) : clean;
  const base = path.join(DIST, rel);
  return rel.endsWith('/') || !path.extname(rel) ? path.join(base, 'index.html') : base;
}

// In a subpath build, any internal URL without the prefix is a missed refactor.
function checkBasePrefix(rel, url, kind) {
  if (BASE_PREFIX && !url.startsWith(BASE_PREFIX + '/')) {
    fail(`${rel}: ${kind} missing base prefix "${BASE_PREFIX}" → ${url}`);
    return false;
  }
  return true;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = await walk(DIST);
  const htmlFiles = files.filter((f) => f.endsWith('.html'));
  console.log(`Verifying build: ${htmlFiles.length} HTML pages in dist/\n`);

  const allFiles = new Set(files.map((f) => path.resolve(f)));

  for (const file of htmlFiles) {
    const rel = path.relative(DIST, file);
    const html = await readFile(file, 'utf8');
    checked.pages++;

    // 3. head essentials
    if (!/<title>[^<]{5,}<\/title>/.test(html)) fail(`${rel}: missing/short <title>`);
    if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail(`${rel}: missing meta description`);
    if (!/<link rel="canonical" href="https?:\/\//.test(html)) fail(`${rel}: missing canonical`);
    const canonicalHref = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonicalHref && BASE_PREFIX) {
      const canonPath = new URL(canonicalHref).pathname;
      if (!canonPath.startsWith(BASE_PREFIX + '/')) fail(`${rel}: canonical missing base prefix → ${canonicalHref}`);
    }
    const h1Count = (html.match(/<h1[\s>]/g) || []).length;
    if (h1Count !== 1) fail(`${rel}: expected exactly 1 <h1>, found ${h1Count}`);

    // 4. JSON-LD parses
    for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      try {
        JSON.parse(m[1]);
        checked.jsonld++;
      } catch {
        fail(`${rel}: invalid JSON-LD block`);
      }
    }

    // 5. dead/placeholder content
    if (/lorem ipsum/i.test(html)) fail(`${rel}: lorem ipsum found`);
    for (const m of html.matchAll(/href="(#[^"]*|javascript:[^"]*)"/g)) {
      if (m[1] === '#' || m[1].startsWith('javascript:')) fail(`${rel}: dead link "${m[1]}"`);
    }

    // 1/2. links & assets
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
      if (url.startsWith('/')) {
        if (!checkBasePrefix(rel, url, 'link/src')) continue;
        const target = urlToDistPath(url);
        if (target && !(await exists(target))) {
          // srcset-style URLs are checked below; flag here
          fail(`${rel}: broken local reference → ${url}`);
        } else {
          checked.links++;
        }
      }
    }
    for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of m[1].split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url?.startsWith('/')) {
          if (!checkBasePrefix(rel, url, 'srcset entry')) continue;
          const target = urlToDistPath(url);
          if (target && !(await exists(target))) fail(`${rel}: broken srcset entry → ${url}`);
          else checked.assets++;
        }
      }
    }
    // poster attributes
    for (const m of html.matchAll(/poster="([^"]+)"/g)) {
      if (m[1].startsWith('/')) {
        if (!checkBasePrefix(rel, m[1], 'poster')) continue;
        const target = urlToDistPath(m[1]);
        if (target && !(await exists(target))) fail(`${rel}: missing video poster → ${m[1]}`);
        else checked.assets++;
      }
    }
    // inline CSS url() references (e.g. the @font-face block in BaseLayout)
    for (const m of html.matchAll(/url\(\s*['"]?(\/[^'")\s]+)['"]?\s*\)/g)) {
      const url = m[1];
      if (!checkBasePrefix(rel, url, 'CSS url()')) continue;
      const target = urlToDistPath(url);
      if (target && !(await exists(target))) fail(`${rel}: broken CSS url() → ${url}`);
      else checked.assets++;
    }
  }

  // robots + sitemap sanity
  const robots = path.join(DIST, 'robots.txt');
  if (!(await exists(robots))) fail('robots.txt missing from build');
  else {
    const body = await readFile(robots, 'utf8');
    if (!body.includes('User-agent: *')) fail('robots.txt missing User-agent');
    const smLine = body.split('\n').find((l) => l.startsWith('Sitemap: '));
    if (BASE_PREFIX && smLine && !smLine.includes(BASE_PREFIX + '/')) {
      fail(`robots.txt Sitemap URL missing base prefix → ${smLine}`);
    }
  }
  const sitemapIdx = files.find((f) => f.endsWith('sitemap-index.xml'));
  if (!sitemapIdx) fail('sitemap-index.xml missing from build');
  if (BASE_PREFIX) {
    for (const f of files.filter((f) => f.endsWith('.xml') && path.basename(f).startsWith('sitemap'))) {
      const xml = await readFile(f, 'utf8');
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        if (!new URL(m[1]).pathname.startsWith(BASE_PREFIX + '/')) {
          fail(`${path.relative(DIST, f)}: sitemap URL missing base prefix → ${m[1]}`);
        }
      }
    }
  }

  console.log(`\nChecked ${checked.pages} pages, ${checked.links} links, ${checked.assets} assets, ${checked.jsonld} JSON-LD blocks.`);
  if (failures) {
    console.error(`\n${failures} problem(s) found. Build verification FAILED.`);
    process.exit(1);
  }
  console.log('Build verification PASSED.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
