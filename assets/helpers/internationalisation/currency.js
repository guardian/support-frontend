// @flow

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

export function forCountry(country: IsoCountry): Currency {
  switch (country) {
    case 'US': return USD;
    case 'GB': return GBP;
    default: return GBP;
  }
}
