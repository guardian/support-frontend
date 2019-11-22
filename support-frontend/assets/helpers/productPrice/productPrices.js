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
import type { Promotion } from 'helpers/productPrice/promotions';
import { applyDiscount, getPromotion } from 'helpers/productPrice/promotions';

// ----- Types ----- //

export type ProductPrice = {
  price: number,
  currency: IsoCurrency,
  promotions?: Promotion[],
}

export type CountryGroupPrices = {
  [FulfilmentOptions]: {
    [ProductOptions]: {
      [BillingPeriod]: {
        [IsoCurrency]: ProductPrice
      }
    }
  }
};

export type ProductPrices = {
  [CountryGroupName]: CountryGroupPrices,
}

export type BillingPeriods = {
  [BillingPeriod]: {
    [IsoCurrency]: ProductPrice
  }
}

const isNumeric = (num: ?number): boolean %checks =>
  num !== null &&
  num !== undefined &&
  !Number.isNaN(num);

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
  return productPrices[countryGroup.name][fulfilmentOption ||
  NoFulfilmentOptions][productOption || NoProductOptions][billingPeriod][countryGroup.currency];
}

function finalPrice(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ProductPrice {
  return applyDiscount(
    getProductPrice(
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

const showPrice = (p: ProductPrice, isExtended: boolean = true): string => {
  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${fixDecimals(p.price)}`;
};

const displayPrice = (
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
) => showPrice(getProductPrice(
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
  getProductPrice,
  finalPrice,
  getCurrency,
  getCountryGroup,
  showPrice,
  displayPrice,
  isNumeric,
};
