// @flow

import { getQueryParameter } from 'helpers/url';
import type { CountryGroupId } from './countryGroup';
import { countryGroups } from './countryGroup';


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

function fromIsoCurrency(isoCurrency: IsoCurrency): ?Currency {
  switch (isoCurrency) {
    case 'USD': return USD;
    case 'GBP': return GBP;
    case 'AUD': return AUD;
    default: return null;
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

function detect(countryGroup: CountryGroupId): Currency {
  return fromQueryParameter() || fromIsoCurrency(countryGroups[countryGroup].currency) || GBP;
}

export {
  detect,
  spokenCurrencies,
};
