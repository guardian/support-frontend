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
import type { Option } from 'helpers/types/option';
import { getQueryParameter } from 'helpers/url';
import { Quarterly, SixWeekly } from 'helpers/billingPeriods';

// ----- Types ----- //

export type DiscountBenefit = {
  amount: number,
  durationMonths?: number,
}

export type IntroductoryPeriodType = 'issue';

export type IntroductoryPriceBenefit = {
  price: number,
  periodLength: number,
  periodType: IntroductoryPeriodType,
}

export type Promotion =
  {
    name: string,
    description: string,
    promoCode: string,
    discountedPrice?: number,
    numberOfDiscountedPeriods?: number,
    discount?: DiscountBenefit,
    introductoryPrice?: IntroductoryPriceBenefit,
  }

export type ProductPrice = {
  price: number,
  currency: IsoCurrency,
  promotions?: Promotion[],
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

const isNumeric = (num: ?number): boolean %checks =>
  num !== null &&
  num !== undefined &&
  !Number.isNaN(num);

const hasDiscount = (promotion: ?Promotion): boolean %checks =>
  promotion !== null &&
  promotion !== undefined &&
  isNumeric(promotion.discountedPrice);

const hasIntroductoryPrice = (promotion: ?Promotion): boolean %checks =>
  promotion !== null &&
  promotion !== undefined &&
  !!promotion.introductoryPrice;

function applyDiscount(price: ProductPrice, promotion: ?Promotion) {
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
  return productPrices[countryGroup.name][fulfilmentOption ||
  NoFulfilmentOptions][productOption || NoProductOptions][billingPeriod ===
  SixWeekly ? Quarterly : billingPeriod][countryGroup.currency];
}

const matchesQueryParam = promotion =>
  getQueryParameter('promoCode') === promotion.promoCode;

const introductoryPrice = promotion =>
  promotion.introductoryPrice !== null && promotion.introductoryPrice !==
  undefined;

function getAppliedPromo(promotions: ?Promotion[]): Option<Promotion> {
  if (promotions && promotions.length > 0) {
    if (promotions.length > 1) {
      return promotions.find(introductoryPrice) ||
        promotions.find(matchesQueryParam) ||
        promotions[0];
    }
    return promotions[0];
  }
  return null;
}

function getPromotion(
  productPrices: ProductPrices,
  country: IsoCountry,
  billingPeriod: BillingPeriod,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ?Promotion {
  return getAppliedPromo(getProductPrice(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  ).promotions);
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
  getAppliedPromo,
  getProductPrice,
  getPromotion,
  finalPrice,
  getCurrency,
  getCountryGroup,
  showPrice,
  displayPrice,
  applyDiscount,
  hasDiscount,
  hasIntroductoryPrice,
  isNumeric,
};
