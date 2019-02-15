// @flow

// ----- Imports ----- //
import { type PriceWithCurrency } from 'helpers/productPrice/priceWithCurrency';
import { type CountryGroupId } from './countryGroup';

// ----- Functions ----- //

const GBP = (value: number): PriceWithCurrency => ({ value, currency: 'GBP' });
const USD = (value: number): PriceWithCurrency => ({ value, currency: 'USD' });
const AUD = (value: number): PriceWithCurrency => ({ value, currency: 'AUD' });
const EUR = (value: number): PriceWithCurrency => ({ value, currency: 'EUR' });
const NZD = (value: number): PriceWithCurrency => ({ value, currency: 'NZD' });
const CAD = (value: number): PriceWithCurrency => ({ value, currency: 'CAD' });

function priceByCountryGroupId(countryGroupId: CountryGroupId, price: number): PriceWithCurrency {
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


// ----- Exports ----- //

export {
  GBP,
  USD,
  AUD,
  EUR,
  NZD,
  CAD,
  priceByCountryGroupId,
};
