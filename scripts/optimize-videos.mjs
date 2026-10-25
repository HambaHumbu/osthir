#!/usr/bin/env node
/**
 * Osthir Test, video optimization pipeline.
 *
 * Uses the bundled ffmpeg (npm package `ffmpeg-static`) to read the ORIGINAL
 * mp4 files in the project root (never modifies them) and produce web
 * derivatives in public/media/video/:
 *   - <name>.mp4          1280x720 H.264, CRF 26, +faststart, audio stripped
 *   - <name>-poster.jpg   poster frame (also .webp)
 * The brand film is trimmed to 6.6s so the outro card (which contains
 * non-brand calligraphy) is excluded from the website version.
 *
 * Usage: node scripts/optimize-videos.mjs
 */
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

const require = createRequire(import.meta.url);
const FFMPEG = require('ffmpeg-static');
const run = promisify(execFile);
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'media', 'video');

// name → [source file, poster time (s), trim duration (s) or null]
const VIDEOS = {
  'hero-loop': ['osthir-v1-hero-loop.mp4', 6.0, null],
  'brand-film': ['osthir-v2-brand-film.mp4', 1.0, 6.6],
  'biryani-pot-reveal': ['osthir-v3-biryani-pot-reveal.mp4', 6.0, null],
  'curry-simmer': ['osthir-v4-curry-simmer.mp4', 4.0, null],
  'malai-tea-pour': ['osthir-v5-malai-tea-pour.mp4', 3.0, null],
  'lassi-pour': ['osthir-v6-lassi-pour.mp4', 5.0, null],
};

async function ffmpeg(args) {
  await run(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};

  for (const [name, [src, posterAt, trim]] of Object.entries(VIDEOS)) {
    const srcPath = path.join(ROOT, src);
    const outMp4 = path.join(OUT, `${name}.mp4`);
    const trimArgs = trim ? ['-t', String(trim)] : [];
    await ffmpeg([
      '-i', srcPath,
      ...trimArgs,
      '-an',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '26',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=1280:-2',
      '-movflags', '+faststart',
      outMp4,
    ]);
    const posterJpg = path.join(OUT, `${name}-poster.jpg`);
    await ffmpeg(['-ss', String(posterAt), '-i', srcPath, '-frames:v', '1', '-q:v', '3', posterJpg]);
    await ffmpeg(['-ss', String(posterAt), '-i', srcPath, '-frames:v', '1', '-q:v', '5', path.join(OUT, `${name}-poster.webp`)]);
    manifest[name] = { src, posterAt, trim, out: `media/video/${name}.mp4`, poster: `media/video/${name}-poster.jpg` };
    console.log(`video ${name}: encoded${trim ? ` (trimmed to ${trim}s)` : ''} + poster`);
  }

  await writeFile(path.join(OUT, 'video-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log('video manifest written: public/media/video/video-manifest.json');
}

main().catch((err) => {
  console.error(err.stderr || err);
  process.exit(1);
});
