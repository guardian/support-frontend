// @flow

// ----- Imports ----- //

import { type IsoCurrency, glyph, extendedGlyph } from './currency';


// ----- Types ----- //

export type Price = $ReadOnly<{|
  value: number,
  currency: IsoCurrency,
|}>;


// ----- Functions ----- //

const GBP = (value: number): Price => ({ value, currency: 'GBP' });
const USD = (value: number): Price => ({ value, currency: 'USD' });
const AUD = (value: number): Price => ({ value, currency: 'AUD' });
const EUR = (value: number): Price => ({ value, currency: 'EUR' });
const NZD = (value: number): Price => ({ value, currency: 'NZD' });
const CAD = (value: number): Price => ({ value, currency: 'CAD' });

function showPrice(p: Price, isExtended: boolean = false): string {

  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${p.value.toFixed(2)}`;

}


// ----- Exports ----- //

export {
  GBP,
  USD,
  AUD,
  EUR,
  NZD,
  CAD,
  showPrice,
};
