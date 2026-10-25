// Plain-JS mirror of the public site URL so astro.config.mjs (which runs
// outside the TypeScript pipeline) and the rest of the site share one value.
//
// The public domain is not known yet. Set the real domain either:
//   1. in a local `.env` file:  SITE_URL=https://www.your-domain.com
//   2. or by editing the fallback below.
// Until then, the placeholder below is used and the build prints a warning.

export const SITE_URL_PLACEHOLDER = 'https://osthir-test.example.com';

export const SITE_URL =
  (typeof process !== 'undefined' && process.env && process.env.SITE_URL) ||
  SITE_URL_PLACEHOLDER;

export const SITE_URL_IS_PLACEHOLDER = SITE_URL === SITE_URL_PLACEHOLDER;
