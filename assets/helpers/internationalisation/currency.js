// @flow

import { getQueryParameter } from 'helpers/url';
import { countryGroups } from './countryGroup';

import type { CountryGroup, CountryGroupId } from './countryGroup';


export type IsoCurrency =
  | 'GBP'
  | 'USD'
  | 'AUD'
  | 'EUR'
  | 'NZD';

export type Currency = {
  iso: IsoCurrency,
  glyph: string,
  extendedGlyph: string,
};

export const GBP: Currency = {
  iso: 'GBP',
  glyph: '£',
  extendedGlyph: '£',
};

export const USD: Currency = {
  iso: 'USD',
  glyph: '$',
  extendedGlyph: 'US$',
};

export const AUD: Currency = {
  iso: 'AUD',
  glyph: '$',
  extendedGlyph: 'AU$',
};

export const EUR: Currency = {
  iso: 'EUR',
  glyph: '€',
  extendedGlyph: '€',
};

export const NZD: Currency = {
  iso: 'NZD',
  glyph: '$',
  extendedGlyph: 'NZ$',
};

const currencies = {
  GBP,
  USD,
  AUD,
  EUR,
  NZD,
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
};


function fromIsoCurrency(isoCurrency: IsoCurrency): ?Currency {
  switch (isoCurrency) {
    case 'USD': return USD;
    case 'GBP': return GBP;
    case 'AUD': return AUD;
    case 'EUR': return EUR;
    case 'NZD': return NZD;
    default: return null;
  }
}

function fromCountryGroupId(countryGroupId: CountryGroupId): ?Currency {
  const countryGroup: ?CountryGroup = countryGroups[countryGroupId];

  if (!countryGroup) {
    return null;
  }

  return fromIsoCurrency(countryGroup.currency);
}


function fromString(s: string): ?Currency {
  switch (s.toLowerCase()) {
    case 'gbp': return GBP;
    case 'usd': return USD;
    case 'aud': return AUD;
    case 'eur': return EUR;
    case 'nzd': return NZD;
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

function detect(countryGroup: CountryGroupId): Currency {
  return fromQueryParameter() || fromCountryGroupId(countryGroup) || GBP;
}

export {
  detect,
  spokenCurrencies,
  currencies,
};
