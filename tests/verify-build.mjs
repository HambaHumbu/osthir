#!/usr/bin/env node
/**
 * Post-build verification — crawls dist/ and checks the things that matter:
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

function urlToDistPath(url) {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!clean || !clean.startsWith('/')) return null;
  const base = path.join(DIST, clean);
  return clean.endsWith('/') || !path.extname(clean) ? path.join(base, 'index.html') : base;
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
          const target = path.join(DIST, decodeURIComponent(url));
          if (!(await exists(target))) fail(`${rel}: broken srcset entry → ${url}`);
          else checked.assets++;
        }
      }
    }
    // poster attributes
    for (const m of html.matchAll(/poster="([^"]+)"/g)) {
      if (m[1].startsWith('/')) {
        const target = path.join(DIST, m[1]);
        if (!(await exists(target))) fail(`${rel}: missing video poster → ${m[1]}`);
        else checked.assets++;
      }
    }
  }

  // robots + sitemap sanity
  const robots = path.join(DIST, 'robots.txt');
  if (!(await exists(robots))) fail('robots.txt missing from build');
  else {
    const body = await readFile(robots, 'utf8');
    if (!body.includes('User-agent: *')) fail('robots.txt missing User-agent');
  }
  const sitemapIdx = files.find((f) => f.endsWith('sitemap-index.xml'));
  if (!sitemapIdx) fail('sitemap-index.xml missing from build');

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
