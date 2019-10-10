// @flow

import { getQueryParameter } from 'helpers/url';
import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
  ProductPrice,
  ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getProductPrice, isNumeric } from 'helpers/productPrice/productPrices';

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
export type LandingPage = {
  title?: string,
  description?: string,
  roundel?: string,
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
    landingPage?: LandingPage,
  }
const hasDiscount = (promotion: ?Promotion): boolean %checks =>
  promotion !== null &&
  promotion !== undefined &&
  isNumeric(promotion.discountedPrice);
const hasIntroductoryPrice = (promotion: ?Promotion): boolean %checks =>
  promotion !== null &&
  promotion !== undefined &&
  !!promotion.introductoryPrice;

function applyDiscount(price: ProductPrice, promotion: ?Promotion) {
  if (hasDiscount(promotion)) {
    return {
      ...price,
      price: promotion.discountedPrice,
    };
  } else if (hasIntroductoryPrice(promotion)) {
    return {
      ...price,
      // $FlowIgnore - we have checked this above
      price: promotion.introductoryPrice.price,
    };
  }
  return price;
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

export {
  getPromotion,
  getAppliedPromo,
  applyDiscount,
  hasIntroductoryPrice,
  hasDiscount,
};
