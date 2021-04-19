// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';

import {
  type CountryGroup,
  type CountryGroupId,
  countryGroups,
} from './countryGroup';
import type { IsoCountry } from './country';

// ----- Types ----- //

export type IsoCurrency =
  | 'GBP'
  | 'USD'
  | 'AUD'
  | 'EUR'
  | 'NZD'
  | 'CAD'
  | 'SEK'
  | 'CHF'
  | 'NOK'
  | 'DKK';

export type Currency = {|
  glyph: string,
  extendedGlyph: string,
  isSuffixGlyph: boolean | null,
  isPaddedGlyph: boolean | null,
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
  SEK: {
    glyph: 'kr',
    extendedGlyph: 'kr',
    isSuffixGlyph: true,
    isPaddedGlyph: true,
  },
  CHF: {
    glyph: 'fr.',
    extendedGlyph: 'fr.',
    isSuffixGlyph: true,
    isPaddedGlyph: true,
  },
  NOK: {
    glyph: 'kr',
    extendedGlyph: 'kr',
    isSuffixGlyph: true,
    isPaddedGlyph: true,
  },
  DKK: {
    glyph: 'kr.',
    extendedGlyph: 'kr.',
    isSuffixGlyph: true,
    isPaddedGlyph: true,
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
  SEK: {
    singular: 'krona',
    plural: 'kronor',
  },
  CHF: {
    singular: 'franc',
    plural: 'francs',
  },
  NOK: {
    singular: 'krone',
    plural: 'kroner',
  },
  DKK: {
    singular: 'krone',
    plural: 'kroner',
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
    case 'sek': return 'SEK';
    case 'chf': return 'CHF';
    case 'nok': return 'NOK';
    case 'dkk': return 'DKK';
    default: return null;
  }
}

function localCurrencyFromCountryCode(countryCode: IsoCountry): ?IsoCurrency {
  switch (countryCode.toLowerCase()) {
    case 'se': return 'SEK';
    case 'ch': return 'CHF';
    case 'no': return 'NOK';
    case 'dk': return 'DKK';
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

const glyph = (c: IsoCurrency): string => currencies[c].glyph;
const extendedGlyph = (c: IsoCurrency): string => currencies[c].extendedGlyph;
const isSuffixGlyph = (c: IsoCurrency): string => currencies[c].isSuffixGlyph;
const isPaddedGlyph = (c: IsoCurrency): string => currencies[c].isPaddedGlyph;

// ----- Exports ----- //

export {
  detect,
  spokenCurrencies,
  fromCountryGroupId,
  localCurrencyFromCountryCode,
  currencies,
  glyph,
  extendedGlyph,
  isSuffixGlyph,
  isPaddedGlyph,
};
