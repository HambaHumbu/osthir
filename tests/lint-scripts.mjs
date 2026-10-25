#!/usr/bin/env node
/**
 * Lint (npm run lint): syntax-checks every .mjs/.js file in scripts/, tests/,
 * src/config, src/data, src/lib, and validates JSON files we depend on.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIRS = ['scripts', 'tests', 'src/config', 'src/data', 'src/lib'];
const JSON_FILES = ['package.json', 'src/data/media-manifest.json', 'public/media/video/video-manifest.json'];

let failures = 0;
let checked = 0;

function* jsFiles(dir) {
  for (const entry of readdirSync(path.join(ROOT, dir))) {
    const p = path.join(dir, entry);
    const abs = path.join(ROOT, p);
    if (statSync(abs).isDirectory()) yield* jsFiles(p);
    else if (/\.(mjs|js)$/.test(entry)) yield abs;
  }
}

for (const dir of DIRS) {
  for (const file of jsFiles(dir)) {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
      checked++;
    } catch (err) {
      failures++;
      console.error(`  ✗ syntax error in ${path.relative(ROOT, file)}:\n${err.stderr?.toString()}`);
    }
  }
}

for (const f of JSON_FILES) {
  try {
    JSON.parse(readFileSync(path.join(ROOT, f), 'utf8'));
    checked++;
  } catch (err) {
    failures++;
    console.error(`  ✗ invalid JSON: ${f}: ${err.message}`);
  }
}

if (failures) {
  console.error(`\n${failures} problem(s). Lint FAILED.`);
  process.exit(1);
}
console.log(`Lint PASSED (${checked} files checked).`);
