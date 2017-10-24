// @flow

import { getQueryParameter } from 'helpers/url';
import type { IsoCountry } from './country';

export type IsoCurrency =
  | 'GBP'
  | 'USD';

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

function forCountry(country: IsoCountry): Currency {
  switch (country) {
    case 'US': return USD;
    case 'GB': return GBP;
    default: return GBP;
  }
}

function fromString(s: string): ?Currency {
  switch (s.toLowerCase()) {
    case 'gbp': return GBP;
    case 'usd': return USD;
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

export function detect(country: IsoCountry): Currency {
  return fromQueryParameter() || forCountry(country);
}
