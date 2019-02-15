// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';

import {
  type CountryGroup,
  type CountryGroupId,
  countryGroups,
} from './countryGroup';


// ----- Types ----- //

const GBP: 'GBP' = 'GBP';
const USD: 'USD' = 'USD';
const AUD: 'AUD' = 'AUD';
const EUR: 'EUR' = 'EUR';
const NZD: 'NZD' = 'NZD';
const CAD: 'CAD' = 'CAD';


export type IsoCurrency =
  | typeof GBP
  | typeof USD
  | typeof AUD
  | typeof EUR
  | typeof NZD
  | typeof CAD;

export type Currency = {|
  glyph: string,
  extendedGlyph: string,
|};

export type SpokenCurrency = {|
  singular: string,
  plural: string,
|};


// ----- Config ----- //

const currencies: {
  [IsoCurrency]: Currency,
} = {
  GBP: {
    glyph: '£',
    extendedGlyph: '£',
  },
  USD: {
    glyph: '$',
    extendedGlyph: 'US$',
  },
  AUD: {
    glyph: '$',
    extendedGlyph: 'AU$',
  },
  EUR: {
    glyph: '€',
    extendedGlyph: '€',
  },
  NZD: {
    glyph: '$',
    extendedGlyph: 'NZ$',
  },
  CAD: {
    glyph: '$',
    extendedGlyph: 'CA$',
  },
};

const spokenCurrencies: {
  [IsoCurrency]: SpokenCurrency,
} = {
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
  NZD: {
    singular: 'dollar',
    plural: 'dollars',
  },
  CAD: {
    singular: 'dollar',
    plural: 'dollars',
  },
};


// ----- Functions ----- //

function fromCountryGroupId(countryGroupId: CountryGroupId): ?IsoCurrency {
  const countryGroup: ?CountryGroup = countryGroups[countryGroupId];

  if (!countryGroup) {
    return null;
  }

  return countryGroup.currency;
}

function fromString(s: string): ?IsoCurrency {
  switch (s.toLowerCase()) {
    case 'gbp': return GBP;
    case 'usd': return USD;
    case 'aud': return AUD;
    case 'eur': return EUR;
    case 'nzd': return NZD;
    case 'cad': return CAD;
    default: return null;
  }
}

function fromQueryParameter(): ?IsoCurrency {
  const currency = getQueryParameter('currency');
  if (currency) {
    return fromString(currency);
  }
  return null;
}

function detect(countryGroup: CountryGroupId): IsoCurrency {
  return fromQueryParameter() || fromCountryGroupId(countryGroup) || GBP;
}

const glyph = (c: IsoCurrency): string => currencies[c].glyph;
const extendedGlyph = (c: IsoCurrency): string => currencies[c].extendedGlyph;


// ----- Exports ----- //

export {
  detect,
  spokenCurrencies,
  fromCountryGroupId,
  currencies,
  glyph,
  extendedGlyph,
  GBP,
  USD,
  EUR,
  AUD,
  NZD,
  CAD,
};
