// Central ordering behaviour. There is exactly one source of truth:
// site.orderingUrl in src/config/site.js.
//
//  - When a real ordering provider URL is configured, every order action
//    links straight to it.
//  - When it is not configured, order actions route to the menu page so the
//    visitor can keep browsing, and the UI says plainly that online ordering
//    is not connected yet. No fake checkout, no fake success states.
import site from '../config/site.js';
import { href } from './url.js';

export function orderAction() {
  if (site.orderingUrl) {
    return {
      href: site.orderingUrl,
      external: true,
      label: site.orderingLabel,
      connected: true,
    };
  }
  return {
    href: href('/menu/'),
    external: false,
    label: 'Browse the Menu',
    connected: false,
  };
}
