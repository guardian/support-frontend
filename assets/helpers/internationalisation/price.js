// @flow

// ----- Imports ----- //

import {
  AUD,
  CAD,
  EUR,
  GBP,
  NZD,
  USD,
} from 'helpers/internationalisation/currency';
import { extendedGlyph, glyph, type IsoCurrency } from './currency';
import {
  AUDCountries,
  Canada,
  type CountryGroupId, EURCountries,
  GBPCountries,
  International,
  NZDCountries,
  UnitedStates,
} from './countryGroup';

// ----- Types ----- //

export type Price = $ReadOnly<{|
  value: number,
  currency: IsoCurrency,
|}>;


// ----- Functions ----- //

const GBPPrice = (value: number): Price => ({ value, currency: GBP });
const USDPrice = (value: number): Price => ({ value, currency: USD });
const AUDPrice = (value: number): Price => ({ value, currency: AUD });
const EURPrice = (value: number): Price => ({ value, currency: EUR });
const NZDPrice = (value: number): Price => ({ value, currency: NZD });
const CADPrice = (value: number): Price => ({ value, currency: CAD });

function priceByCountryGroupId(countryGroupId: CountryGroupId, price: number): Price {
  switch (countryGroupId) {
    case GBPCountries: return GBPPrice(price);
    case AUDCountries: return AUDPrice(price);
    case International: return USDPrice(price);
    case NZDCountries: return NZDPrice(price);
    case EURCountries: return EURPrice(price);
    case Canada: return CADPrice(price);
    default:
    case UnitedStates: return USDPrice(price);
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
