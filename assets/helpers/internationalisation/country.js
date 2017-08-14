// @flow

import { getQueryParameter } from 'helpers/url';
import * as cookie from './../cookie';

export type IsoCountry =
  | 'GB'
  | 'US';

function fromString(s: string): ?IsoCountry {
  switch (s.toLowerCase()) {
    case 'gb': return 'GB';
    case 'uk': return 'GB';
    case 'us': return 'US';
    default: return null;
  }
}

function fromPath(path: string = window.location.pathname): ?IsoCountry {
  if (path.startsWith('/s/uk')) {
    return 'GB';
  } else if (path.startsWith('/s/us')) {
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

export function detect(): IsoCountry {
  const country = fromPath() || fromQueryParameter() || fromCookie() || fromGeolocation() || 'GB';
  // cookie.set('GU_country', country, 7);
  // Always return GB because we aren't ready to support US quite yet
  return 'GB' || country;
}

