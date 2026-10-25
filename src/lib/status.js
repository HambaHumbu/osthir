// Opening status for the city/status bar.
//
// Before an openingDate exists in the config, the status is always
// "Opening soon". We never show OPEN or CLOSED before launch. Once an
// openingDate is set and has passed, the live label is computed from the
// 11:00 to 02:00 window, which crosses midnight. That compute is time- and
// timezone-dependent, so the server renders the safe default and a small
// client script in StatusBar refines it when a real date exists.
import site from '../config/site.js';

// Server-safe default. Returns the label to render at build time.
export function statusDefault() {
  const { openingDate } = site.location;
  if (!openingDate) return { state: 'soon', label: 'Opening soon' };
  // A date exists but the client decides open/closed; render a neutral label
  // until the browser computes the live one.
  return { state: 'scheduled', label: 'Opening soon' };
}

export default statusDefault;
