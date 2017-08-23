// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import * as cookie from './../cookie';


// ----- Types ----- //

export type IsoCountry =
  | 'GB'
  | 'US';

type usState = {
  code: string,
  name: string,
};


// ----- Setup ----- //

const usStates: usState[] = [
  { code: 'AA', name: 'Armed Forces America' },
  { code: 'AE', name: 'Armed Forces' },
  { code: 'AP', name: 'Armed Forces Pacific' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AL', name: 'Alabama' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DC', name: 'Washington DC (District of Columbia)' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'GU', name: 'Guam' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'IA', name: 'Iowa' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MD', name: 'Maryland' },
  { code: 'ME', name: 'Maine' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MT', name: 'Montana' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NY', name: 'New York' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VA', name: 'Virginia' },
  { code: 'VI', name: 'Virgin Islands' },
  { code: 'VT', name: 'Vermont' },
  { code: 'WA', name: 'Washington' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WY', name: 'Wyoming' },
];


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
  return country;
}


// ----- Exports ----- //

export {
  detect,
  usStates,
};
