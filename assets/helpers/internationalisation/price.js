// @flow

// ----- Imports ----- //
import { type Price } from 'helpers/productPrice/productPrices';
import { type CountryGroupId } from './countryGroup';

// ----- Functions ----- //

const GBP = (price: number): Price => ({ price, currency: 'GBP' });
const USD = (price: number): Price => ({ price, currency: 'USD' });
const AUD = (price: number): Price => ({ price, currency: 'AUD' });
const EUR = (price: number): Price => ({ price, currency: 'EUR' });
const NZD = (price: number): Price => ({ price, currency: 'NZD' });
const CAD = (price: number): Price => ({ price, currency: 'CAD' });

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
