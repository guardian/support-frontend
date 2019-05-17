// @flow
import type {
  CountryGroupName,
  CountryGroup,
} from 'helpers/internationalisation/countryGroup';
import {
  countryGroups,
  fromCountry,
  GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
  type IsoCurrency,
  glyph,
  extendedGlyph,
} from 'helpers/internationalisation/currency';
import { Monthly } from 'helpers/billingPeriods';

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

const isNumeric = (num: ?number) =>
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

function getCountryGroup(country: IsoCountry): CountryGroup {
  return countryGroups[fromCountry(country) || GBPCountries];
}

function getPromotion(
  productPrices: ProductPrices,
  countryGroup: CountryGroup,
  fulfilmentOption: FulfilmentOptions,
  productOption: ProductOptions,
): ?Promotion {
  return productPrices[countryGroup.name][fulfilmentOption][productOption][Monthly][countryGroup.currency].promotion;
}

function regularPrice(
  productPrices: ProductPrices,
  countryGroup: CountryGroup,
  fulfilmentOption: FulfilmentOptions,
  productOption: ProductOptions,
): Price {
  return {
    price: productPrices[countryGroup.name][fulfilmentOption][productOption][Monthly][countryGroup.currency].price,
    currency: countryGroup.currency,
  };
}

function finalPrice(
  productPrices: ProductPrices,
  country: IsoCountry,
  fulfilmentOption: FulfilmentOptions,
  productOption: ProductOptions,
): Price {
  const countryGroup = getCountryGroup(country);
  return applyDiscount(
    regularPrice(productPrices, countryGroup, fulfilmentOption, productOption),
    getPromotion(productPrices, countryGroup, fulfilmentOption, productOption),
  );
}

const showPrice = (p: Price, isExtended: boolean = true): string => {
  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${p.price.toFixed(2)}`;
};

function getCurrency(country: IsoCountry): IsoCurrency {
  const { currency } = getCountryGroup(country);
  return currency;
}

export {
  finalPrice,
  getCurrency,
  getCountryGroup,
  showPrice,
  applyDiscount,
  hasDiscount,
  isNumeric,
};
