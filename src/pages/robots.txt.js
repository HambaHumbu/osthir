// Generated robots.txt, points crawlers at the live sitemap.
import { SITE_URL } from '../config/site-url.mjs';
import { href } from '../lib/url.js';

export function GET() {
  const sitemapUrl = SITE_URL + href('/sitemap-index.xml');
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
