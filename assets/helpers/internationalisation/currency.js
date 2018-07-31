// @flow

import { getQueryParameter } from 'helpers/url';
import { countryGroups } from './countryGroup';

import type { CountryGroup, CountryGroupId } from './countryGroup';


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
  NZD: {
    singular: 'dollar',
    plural: 'dollars',
  },
  CAD: {
    singular: 'dollar',
    plural: 'dollars',
  },
};

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

export {
  detect,
  fromString,
  spokenCurrencies,
  currencies,
};
