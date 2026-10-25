// Plain-JS mirror of the public site URL so astro.config.mjs (which runs
// outside the TypeScript pipeline) and the rest of the site share one value.
//
// The production domain is osthir.ca (served via GitHub Pages, see
// public/CNAME). Override per-environment with SITE_URL in a local `.env`
// file or the CI build.

export const SITE_URL =
  (typeof process !== 'undefined' && process.env && process.env.SITE_URL) ||
  'https://osthir.ca';
