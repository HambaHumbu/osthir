// Generic place and store model. Adding a real restaurant later is a data
// change here, not a code change. No real locations exist yet, so `stores` is
// empty and the site shows an honest "opening soon" everywhere.

export const defaultCity = 'Canada';
export const defaultTimezone = 'America/Toronto';

// Canadian provinces and the cities people are most likely to ask for. Used by
// the city finder panel and the locations page. This is a wish list, not a
// claim that Osthir is in any of them yet.
export const regions = [
  { province: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'] },
  { province: 'British Columbia', cities: ['Vancouver', 'Surrey', 'Burnaby', 'Victoria'] },
  { province: 'Alberta', cities: ['Calgary', 'Edmonton'] },
  { province: 'Quebec', cities: ['Montreal'] },
  { province: 'Manitoba', cities: ['Winnipeg'] },
  { province: 'Saskatchewan', cities: ['Saskatoon', 'Regina'] },
  { province: 'Nova Scotia', cities: ['Halifax'] },
];

// Real locations, empty until the owner supplies one. Shape, for later:
// { name, city, province, addressLines: [], status: 'opening-soon' | 'open',
//   detailsUrl, hoursSpec: { opens, closes } }
export const stores = [];

export default { defaultCity, defaultTimezone, regions, stores };
