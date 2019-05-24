// @flow
import type {
  CountryGroup,
  CountryGroupName,
} from 'helpers/internationalisation/countryGroup';
import {
  countryGroups,
  fromCountry,
  GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
  extendedGlyph,
  glyph,
  type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { fixDecimals } from 'helpers/subscriptions';

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

function getProductPrice(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ProductPrice {
  const countryGroup = getCountryGroup(country);
  // eslint-disable-next-line max-len
  return productPrices[countryGroup.name][fulfilmentOption || NoFulfilmentOptions][productOption || NoProductOptions][billingPeriod][countryGroup.currency];
}

function getPromotion(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ?Promotion {
  return getProductPrice(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  ).promotion;
}

function regularPrice(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): Price {
  return {
    price: getProductPrice(
      productPrices,
      country,
      billingPeriod,
      fulfilmentOption,
      productOption,
    ).price,
    currency: getCountryGroup(country).currency,
  };
}

function finalPrice(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): Price {
  return applyDiscount(
    regularPrice(
      productPrices,
      country,
      billingPeriod,
      fulfilmentOption,
      productOption,
    ),
    getPromotion(
      productPrices,
      country,
      billingPeriod,
      fulfilmentOption,
      productOption,
    ),
  );
}

const showPrice = (p: Price, isExtended: boolean = true): string => {
  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${fixDecimals(p.price)}`;
};

const displayPrice = (
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
) => showPrice(regularPrice(
  productPrices,
  country,
  billingPeriod,
  fulfilmentOption,
  productOption,
));


function getCurrency(country: IsoCountry): IsoCurrency {
  const { currency } = getCountryGroup(country);
  return currency;
}

export {
  regularPrice,
  getPromotion,
  finalPrice,
  getCurrency,
  getCountryGroup,
  showPrice,
  displayPrice,
  applyDiscount,
  hasDiscount,
  isNumeric,
};
