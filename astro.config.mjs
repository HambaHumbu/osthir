// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config/site-url.mjs';

// Deploy under a subpath (e.g. GitHub Pages project site) with BASE_PATH=/osthir.
const BASE_PATH = process.env.BASE_PATH || '/';

if (BASE_PATH !== '/') {
  console.warn(`\n[osthir] BASE_PATH is "${BASE_PATH}", all internal URLs are prefixed with it.\n`);
}

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
