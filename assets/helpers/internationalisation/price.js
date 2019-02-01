// @flow

// ----- Imports ----- //

import { type IsoCurrency, glyph, extendedGlyph } from './currency';
import { type CountryGroupId } from './countryGroup';


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

function priceByCountryGroupId(countryGroupId: CountryGroupId, price: number): Price {
  switch (countryGroupId) {
    case 'GBPCountries': return GBP(price);
    case 'AUDCountries': return AUD(price);
    case 'International': return USD(price);
    case 'NZDCountries': return NZD(price);
    case 'Canada': return CAD(price);
    default:
    case 'UnitedStates': return USD(price);
  }
}

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
  priceByCountryGroupId,
};
