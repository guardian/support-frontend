// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';

import {
  type CountryGroup,
  type CountryGroupId,
  countryGroups,
} from './countryGroup';


// ----- Types ----- //

export type IsoCurrency =
  | 'GBP'
  | 'USD'
  | 'AUD'
  | 'EUR'
  | 'NZD'
  | 'CAD';

export type Currency = {|
  glyph: string,
  extendedGlyph: string,
|};

export type SpokenCurrency = {|
  singular: string,
  plural: string,
|};

export type Price = $ReadOnly<{|
  value: number,
  currency: IsoCurrency,
|}>;


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
    case 'gbp': return 'GBP';
    case 'usd': return 'USD';
    case 'aud': return 'AUD';
    case 'eur': return 'EUR';
    case 'nzd': return 'NZD';
    case 'cad': return 'CAD';
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
  return fromQueryParameter() || fromCountryGroupId(countryGroup) || 'GBP';
}

const GBP = (value: number): Price => ({ value, currency: 'GBP' });
const USD = (value: number): Price => ({ value, currency: 'USD' });
const AUD = (value: number): Price => ({ value, currency: 'AUD' });
const EUR = (value: number): Price => ({ value, currency: 'EUR' });
const NZD = (value: number): Price => ({ value, currency: 'NZD' });
const CAD = (value: number): Price => ({ value, currency: 'CAD' });


// ----- Exports ----- //

export {
  detect,
  spokenCurrencies,
  fromCountryGroupId,
  currencies,
  GBP,
  USD,
  AUD,
  EUR,
  NZD,
  CAD,
};
