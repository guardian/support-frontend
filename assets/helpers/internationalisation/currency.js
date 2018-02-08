// @flow

import { getQueryParameter } from 'helpers/url';
import type { IsoCountry } from './country';

export type IsoCurrency =
  | 'GBP'
  | 'USD'
  | 'AUD'
  | 'EUR';

export type Currency = {
  iso: IsoCurrency,
  glyph: string,
};

export const GBP: Currency = {
  iso: 'GBP',
  glyph: '£',
};

export const USD: Currency = {
  iso: 'USD',
  glyph: '$',
};

export const AUD: Currency = {
  iso: 'AUD',
  glyph: '$',
};

export const EUR: Currency = {
  iso: 'EUR',
  glyph: '€',
};

const spokenCurrencies = {
  GBP: {
    singular: 'pound',
    plural: 'pounds',
  },
  USD: {
    singular: 'dollar',
    plural: 'dollars',
  },
  AUD: {
    singular: 'dollar',
    plural: 'dollars',
  },
  EUR: {
    singular: 'euro',
    plural: 'euros',
  },
};

const euroCountries: {
  [IsoCountry]: string,
} = {
  AD: 'Andorra',
  AL: 'Albania',
  AT: 'Austria',
  BA: 'Bosnia-Herzegovina',
  BE: 'Belgium',
  BG: 'Bulgaria',
  BL: 'Saint Barthélemy',
  CH: 'Switzerland',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DE: 'Germany',
  DK: 'Denmark',
  EE: 'Estonia',
  ES: 'Spain',
  FI: 'Finland',
  FO: 'Faroe Islands',
  FR: 'France',
  GF: 'French Guiana',
  GL: 'Greenland',
  GP: 'Guadeloupe',
  GR: 'Greece',
  HR: 'Croatia',
  HU: 'Hungary',
  IE: 'Ireland',
  IT: 'Italy',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  MC: 'Monaco',
  ME: 'Montenegro',
  MF: 'Saint Martin',
  IS: 'Iceland',
  MQ: 'Martinique',
  MT: 'Malta',
  NL: 'Netherlands',
  NO: 'Norway',
  PF: 'French Polynesia',
  PL: 'Poland',
  PM: 'Saint Pierre & Miquelon',
  PT: 'Portugal',
  RE: 'Réunion',
  RO: 'Romania',
  RS: 'Serbia',
  SE: 'Sweden',
  SI: 'Slovenia',
  SJ: 'Svalbard and Jan Mayen',
  SK: 'Slovakia',
  SM: 'San Marino',
  TF: 'French Southern Territories',
  TR: 'Turkey',
  WF: 'Wallis & Futuna',
  YT: 'Mayotte',
  VA: 'Holy See',
  AX: 'Åland Islands',
};

function isEuroCountry(country: IsoCountry): boolean {
  return Object.prototype.hasOwnProperty.call(euroCountries, country);
}

function forCountry(country: IsoCountry): Currency {
  if (isEuroCountry(country)) {
    return EUR;
  }

  switch (country) {
    case 'US': return USD;
    case 'GB': return GBP;
    case 'AU': return AUD;
    default: return GBP;
  }
}

function fromString(s: string): ?Currency {
  switch (s.toLowerCase()) {
    case 'gbp': return GBP;
    case 'usd': return USD;
    case 'aud': return AUD;
    case 'eur': return EUR;
    default: return null;
  }
}

function fromQueryParameter(): ?Currency {
  const currency = getQueryParameter('currency');
  if (currency) {
    return fromString(currency);
  }
  return null;
}

function detect(country: IsoCountry): Currency {
  return fromQueryParameter() || forCountry(country);
}

export {
  detect,
  isEuroCountry,
  euroCountries,
  spokenCurrencies,
};
