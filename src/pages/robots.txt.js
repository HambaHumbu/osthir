// Generated robots.txt — reflects the configured (or placeholder) SITE_URL.
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from '../config/site-url.mjs';

export function GET() {
  const body = SITE_URL_IS_PLACEHOLDER
    ? `# robots.txt for ${SITE_URL}
# NOTE: SITE_URL is still the placeholder. Set the real domain (see README.md §9)
# before submitting this site to search engines.
User-agent: *
Allow: /

# Sitemap will be live once the real domain is configured:
# Sitemap: ${SITE_URL}/sitemap-index.xml
`
    : `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
