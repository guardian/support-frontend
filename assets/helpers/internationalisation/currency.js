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
  console.log('detecting currency for ' + country);
  switch (country) {
    case 'US': console.log('USD'); return USD;
    case 'GB': console.log('GBP'); return GBP;
    default: return GBP;
  }
}
