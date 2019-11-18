// @flow

import { fixDecimals } from 'helpers/subscriptions';
import type { BillingPeriod } from 'helpers/billingPeriods';
import {
  billingPeriodNoun as upperCaseNoun,
  Quarterly,
  Annual,
} from 'helpers/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { IntroductoryPriceBenefit } from 'helpers/productPrice/promotions';
import {
  getAppliedPromo,
  hasDiscount,
  hasIntroductoryPrice,
} from 'helpers/productPrice/promotions';
import { type Option } from 'helpers/types/option';

const displayPrice = (glyph: string, price: number) => `${glyph}${fixDecimals(price)}`;

const billingPeriodQuantifier = (numberOfBillingPeriods: number, noun: string) =>
  (numberOfBillingPeriods > 1 ?
    `/${noun} for ${numberOfBillingPeriods} ${noun}s` :
    ` for 1 ${noun}`);

const billingPeriodNoun = (billingPeriod: BillingPeriod, orderIsAGift: boolean = false) =>
  upperCaseNoun(billingPeriod, orderIsAGift).toLowerCase();

const billingPeriodNounGift = (billingPeriod: BillingPeriod, orderIsAGift: boolean = false) =>
  upperCaseNoun(billingPeriod, orderIsAGift);

const standardRate = (
  glyph: string,
  price: number,
  billingPeriod: BillingPeriod,
  compact: boolean,
) =>
  (compact ?
    `${displayPrice(glyph, price)}/${billingPeriodNoun(billingPeriod)}`
    :
    `${displayPrice(glyph, price)} every ${billingPeriodNoun(billingPeriod)}`);

const standardRateGift = (
  glyph: string,
  price: number,
  billingPeriod: BillingPeriod,
) =>
  `${billingPeriodNounGift(billingPeriod, true)} for ${displayPrice(glyph, price)}`;

function getDiscountDescription(
  glyph: string,
  price: number,
  discountedPrice: number,
  numberOfDiscountedPeriods: ?number,
  billingPeriod: BillingPeriod,
  compact: boolean,
) {
  const noun = billingPeriodNoun(billingPeriod);

  if (numberOfDiscountedPeriods) {
    const discountCopy = `${displayPrice(
      glyph,
      discountedPrice,
    )}${billingPeriodQuantifier(
      numberOfDiscountedPeriods,
      noun,
    )}`;
    const standard = standardRate(
      glyph, price,
      billingPeriod,
      compact,
    );
    const standardCopy = compact ? `then ${standard}`
      : `then standard rate (${standard})`;
    return `${discountCopy}, ${standardCopy}`;
  }

  return '';
}

const pluralizePeriodType = (numberOfPeriods: number, periodType: string) =>
  (numberOfPeriods > 1 ? `${periodType}s` : periodType);

// This function requires the Quarterly price to be passed into it, we can
// remove it completely once we make 6 for 6 a promotion
const getIntroductoryPriceDescription = (
  glyph: string,
  introPrice: IntroductoryPriceBenefit,
  productPrice: ProductPrice,
  compact: boolean,
) => {
  const standardCopy = standardRate(glyph, productPrice.price, Quarterly, compact);
  const separator = compact ? '/' : ' for the first ';
  const periodType = pluralizePeriodType(introPrice.periodLength, introPrice.periodType);

  return `${glyph}${introPrice.price}${separator}${introPrice.periodLength} ${periodType} (then ${standardCopy})`;
};

const getIntroductoryGiftPriceDescription = (
  glyph: string,
  billingPeriod: BillingPeriod,
  productPrice: ProductPrice,
) =>
  standardRateGift(glyph, productPrice.price, billingPeriod);

function getPriceDescription(
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
  orderIsAGift?: Option<boolean>,
  compact: boolean = false,
): string {
  const glyph = extendedGlyph(productPrice.currency);
  const promotion = getAppliedPromo(productPrice.promotions);

  if (hasIntroductoryPrice(promotion)) {
    return getIntroductoryPriceDescription(
      glyph,
      // $FlowIgnore -- We have checked this in hasIntroductoryPrice
      promotion.introductoryPrice,
      productPrice,
      compact,
    );
  }
  if (orderIsAGift && (billingPeriod === Quarterly || billingPeriod === Annual)) {
    return getIntroductoryGiftPriceDescription(
      glyph,
      billingPeriod,
      productPrice,
    );
  }
  if (hasDiscount(promotion)) {
    return getDiscountDescription(
      glyph,
      productPrice.price,
      // $FlowIgnore -- We have checked this in hasDiscount
      promotion.discountedPrice,
      promotion.numberOfDiscountedPeriods,
      billingPeriod,
      compact,
    );
  }
  return standardRate(glyph, productPrice.price, billingPeriod, compact);
}

function getAppliedPromoDescription(billingPeriod: BillingPeriod, productPrice: ProductPrice) {
  const appliedPromo = getAppliedPromo(productPrice.promotions);
  if (appliedPromo && appliedPromo.landingPage && appliedPromo.landingPage.roundel) {
    return appliedPromo.landingPage.roundel;
  }
  return '';
}

export {
  getPriceDescription,
  getAppliedPromoDescription,
};
