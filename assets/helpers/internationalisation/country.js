// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { isEuroCountry } from 'helpers/internationalisation/currency';
import * as cookie from 'helpers/cookie';


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
  | 'US'
  | 'AU'
  | 'AD'
  | 'AL'
  | 'AT'
  | 'BA'
  | 'BE'
  | 'BG'
  | 'BL'
  | 'CH'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'EE'
  | 'ES'
  | 'FI'
  | 'FO'
  | 'FR'
  | 'GF'
  | 'GL'
  | 'GP'
  | 'GR'
  | 'HR'
  | 'HU'
  | 'IE'
  | 'IT'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MC'
  | 'ME'
  | 'MF'
  | 'IS'
  | 'MQ'
  | 'MT'
  | 'NL'
  | 'NO'
  | 'PF'
  | 'PL'
  | 'PM'
  | 'PT'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'SE'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SM'
  | 'TF'
  | 'TR'
  | 'WF'
  | 'YT'
  | 'VA'
  | 'AX';


export type UsState = $Keys<typeof usStates>;


// ----- Functions ----- /

function fromString(s: string): ?IsoCountry {
  if (isEuroCountry(s.toUpperCase())) {
    return s.toUpperCase();
  }

  switch (s.toLowerCase()) {
    case 'gb': return 'GB';
    case 'uk': return 'GB';
    case 'us': return 'US';
    case 'au': return 'AU';
    default: return null;
  }
}

export function toCountryGroup(isoCountry: IsoCountry): string {
  if (isEuroCountry(isoCountry)) {
    return 'eu';
  }

  switch (isoCountry) {
    case 'US': return 'us';
    case 'AU': return 'au';
    default: return 'uk';
  }
}

function fromPath(path: string = window.location.pathname): ?IsoCountry {
  if (path === '/uk' || path.startsWith('/uk/')) {
    return 'GB';
  } else if (path === '/us' || path.startsWith('/us/')) {
    return 'US';
  } else if (path === '/au' || path.startsWith('/au/')) {
    return 'AU';
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

function setCountry(country: IsoCountry) {
  cookie.set('GU_country', country, 7);
}

function handleEuroCountry(): ?IsoCountry {
  const path = window.location.pathname;

  if (path !== '/eu' && !path.startsWith('/eu/')) {
    return null;
  }

  const tentativeCountry: ?IsoCountry = fromQueryParameter() || fromCookie() || fromGeolocation();

  if (tentativeCountry && isEuroCountry(tentativeCountry)) {
    return tentativeCountry;
  }

  return 'FR';
}

function detect(): IsoCountry {
  const country = handleEuroCountry() || fromPath() || fromQueryParameter() || fromCookie() || fromGeolocation() || 'GB';
  setCountry(country);
  return country;
}


// ----- Exports ----- //

export {
  detect,
  setCountry,
  usStates,
};
