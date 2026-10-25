// Base-path aware URL builder. Astro exposes the configured base as
// import.meta.env.BASE_URL ('/' normally, '/osthir/' for GitHub Pages).
// All internal links and media paths must go through href() so the site
// works both at a domain root and under a subpath.
const BASE = import.meta.env.BASE_URL;

export function href(p) {
  if (!p || !p.startsWith('/')) return p;
  return BASE === '/' ? p : BASE.replace(/\/$/, '') + p;
}

// Astro.url.pathname already includes the base prefix, strip it to recover
// the root-relative route path expected by helpers like canonical().
export function routePath(pathname) {
  if (BASE === '/' || !pathname.startsWith(BASE)) return pathname;
  return '/' + pathname.slice(BASE.length);
}
