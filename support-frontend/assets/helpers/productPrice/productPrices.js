// @flow
import type { CountryGroupName, CountryGroup } from 'helpers/internationalisation/countryGroup';
import { countryGroups, fromCountry, GBPCountries } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency, glyph, extendedGlyph } from 'helpers/internationalisation/currency';

// ----- Types ----- //

export type DiscountBenefit = {
  amount: number,
  durationMonths?: number,
}

export type Promotion =
  {
    name: string,
    description: string,
    promoCode: string,
    discountedPrice?: number,
    numberOfDiscountedPeriods?: number,
    discount?: DiscountBenefit,
  }

export type ProductPrice = {
    price: number,
    promotion?: Promotion
  }

export type ProductPrices = {
  [CountryGroupName]: {
    [FulfilmentOptions]: {
      [ProductOptions]: {
        [BillingPeriod]: {
          [IsoCurrency]: ProductPrice
        }
      }
    }
  }
}

export type Price = {|
  price: number,
  currency: IsoCurrency,
|};

const showPrice = (p: Price, isExtended: boolean = true): string => {
  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${p.price.toFixed(2)}`;
};


function getCountryGroup(country: IsoCountry): CountryGroup {
  return countryGroups[fromCountry(country) || GBPCountries];
}

function getCurrency(country: IsoCountry): IsoCurrency {
  const { currency } = getCountryGroup(country);
  return currency;
}

const isNumeric = (num: ?number)  =>
  num !== null &&
  num !== undefined &&
  !Number.isNaN(num);

const hasDiscount = (promotion: ?Promotion) =>
  promotion !== null &&
  promotion !== undefined &&
  isNumeric(promotion.discountedPrice);

function applyDiscount(price: Price, promotion: ?Promotion) {
  if (promotion && hasDiscount(promotion)) {
    return {
      ...price,
      price: promotion.discountedPrice,
    };
  }
  return price;
}

export {
  getCurrency,
  getCountryGroup,
  showPrice,
  applyDiscount,
  hasDiscount,
  isNumeric,
};
