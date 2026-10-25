// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from './src/config/site-url.mjs';

if (SITE_URL_IS_PLACEHOLDER) {
  console.warn(
    '\n[osthir] SITE_URL is not configured — canonical URLs, sitemap.xml and robots.txt ' +
      'will use the placeholder "' + SITE_URL + '".\n' +
      '         Set SITE_URL in .env or src/config/site-url.mjs before public launch.\n',
  );
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
