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
  console.log('path' + path);
  if (path.startsWith('/uk/')) {
    return 'GB';
  } else if (path.startsWith('/us/')) {
    return 'US';
  }
  return null;
}

function fromQueryParameter(): ?IsoCountry {
  const country = getQueryParameter('country');
  console.log('qp:' + country);
  if (country) {
    return fromString(country);
  }
  return null;
}

function fromCookie(): ?IsoCountry {
  const country = cookie.get('GU_country');
  console.log('cookie:' + country);
  if (country) {
    return fromString(country);
  }
  return null;
}

export function detect(): IsoCountry {
  const country = fromPath() || fromQueryParameter() || fromCookie() || 'GB';
  console.log('detect:' + country);
  cookie.set('GU_country', country, 7);
  return country;
}

