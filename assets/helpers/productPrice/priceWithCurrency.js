// @flow
import { glyph, extendedGlyph, type IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Types ----- //

export type PriceWithCurrency = {|
  value: number,
  currency: IsoCurrency,
|};

export const showPrice = (p: PriceWithCurrency, isExtended: boolean = false): string => {
  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${p.value.toFixed(2)}`;
};
