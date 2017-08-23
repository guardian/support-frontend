// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import * as cookie from './../cookie';


// ----- Setup ----- //

const usStates: {
  [string]: string,
} = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'Washington DC (District of Columbia)',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
  AA: 'Armed Forces America',
  AE: 'Armed Forces',
  AP: 'Armed Forces Pacific',
};


// ----- Types ----- //

export type IsoCountry =
  | 'GB'
  | 'US';

export type UsState = $Keys<typeof usStates>;


// ----- Functions ----- /

function fromString(s: string): ?IsoCountry {
  switch (s.toLowerCase()) {
    case 'gb': return 'GB';
    case 'uk': return 'GB';
    case 'us': return 'US';
    default: return null;
  }
}

function fromPath(path: string = window.location.pathname): ?IsoCountry {
  if (path.startsWith('/uk/')) {
    return 'GB';
  } else if (path.startsWith('/us/')) {
    return 'US';
  }
  return null;
}

function fromQueryParameter(): ?IsoCountry {
  const country = getQueryParameter('country');
  if (country) {
    return fromString(country);
  }
  return null;
}

function fromCookie(): ?IsoCountry {
  const country = cookie.get('GU_country');
  if (country) {
    return fromString(country);
  }
  return null;
}

function fromGeolocation(): ?IsoCountry {
  const country = cookie.get('GU_geo_country');
  if (country) {
    return fromString(country);
  }
  return null;
}

function detect(): IsoCountry {
  const country = fromPath() || fromQueryParameter() || fromCookie() || fromGeolocation() || 'GB';
  // cookie.set('GU_country', country, 7);
  // Always return GB because we aren't ready to support US quite yet
  return 'GB' || country;
}


// ----- Exports ----- //

export {
  detect,
  usStates,
};
