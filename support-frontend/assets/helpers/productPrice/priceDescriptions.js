// @flow

import { fixDecimals } from 'helpers/subscriptions';
import type { BillingPeriod } from 'helpers/billingPeriods';
import {
  billingPeriodNoun as upperCaseNoun,
  Quarterly,
} from 'helpers/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { IntroductoryPriceBenefit } from 'helpers/productPrice/promotions';
import {
  getAppliedPromo,
  hasDiscount,
  hasIntroductoryPrice,
} from 'helpers/productPrice/promotions';

const displayPrice = (glyph: string, price: number) => `${glyph}${fixDecimals(price)}`;

const billingPeriodQuantifier = (numberOfBillingPeriods: number, noun: string, fixedTerm: boolean) => {
  if (fixedTerm) {
    return ` for ${noun}`;
  }
  return numberOfBillingPeriods > 1 ?
    `/${noun} for ${numberOfBillingPeriods} ${noun}s` :
    ` for 1 ${noun}`;
};


const billingPeriodNoun = (billingPeriod: BillingPeriod, fixedTerm: boolean = false) =>
  upperCaseNoun(billingPeriod, fixedTerm).toLowerCase();

const standardRate = (
  glyph: string,
  price: number,
  billingPeriod: BillingPeriod,
  fixedTerm: boolean,
  compact: boolean,
) => {
  if (fixedTerm) {
    return `${displayPrice(glyph, price)} for ${billingPeriodNoun(billingPeriod, fixedTerm)}`;
  }
  return compact ?
    `${displayPrice(glyph, price)}/${billingPeriodNoun(billingPeriod, fixedTerm)}`
    :
    `${displayPrice(glyph, price)} every ${billingPeriodNoun(billingPeriod, fixedTerm)}`;
};

const getStandardRateCopy = (
  glyph: string,
  price: number,
  billingPeriod: BillingPeriod,
  fixedTerm: boolean,
  compact: boolean,
) => {
  if (fixedTerm) { return ''; }

  const standard = standardRate(
    glyph, price,
    billingPeriod,
    fixedTerm,
    compact,
  );
  return compact ? `, then ${standard}` : `, then standard rate (${standard})`;
};

function getDiscountDescription(
  glyph: string,
  price: number,
  fixedTerm: boolean,
  discountedPrice: number,
  numberOfDiscountedPeriods: ?number,
  billingPeriod: BillingPeriod,
  compact: boolean,
) {
  const noun = billingPeriodNoun(billingPeriod, fixedTerm);

  if (numberOfDiscountedPeriods) {
    const discountCopy = `${displayPrice(
      glyph,
      discountedPrice,
    )}${billingPeriodQuantifier(
      numberOfDiscountedPeriods,
      noun,
      fixedTerm,
    )}`;

    const standardCopy = getStandardRateCopy(
      glyph,
      price,
      billingPeriod,
      fixedTerm,
      compact,
    );

    return `${discountCopy}${standardCopy}`;
  }

  return '';
}

const pluralizePeriodType = (numberOfPeriods: number, periodType: string) =>
  (numberOfPeriods > 1 ? `${periodType}s` : periodType);

const getIntroductoryPriceDescription = (
  glyph: string,
  introPrice: IntroductoryPriceBenefit,
  productPrice: ProductPrice,
  compact: boolean,
) => {
  const standardCopy = standardRate(glyph, productPrice.price, Quarterly, productPrice.fixedTerm, compact);
  const separator = compact ? '/' : ' for the first ';
  const periodType = pluralizePeriodType(introPrice.periodLength, introPrice.periodType);

  return `${glyph}${introPrice.price}${separator}${introPrice.periodLength} ${periodType} (then ${standardCopy})`;
};

function getPriceDescription(
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
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
  if (hasDiscount(promotion)) {
    return getDiscountDescription(
      glyph,
      productPrice.price,
      productPrice.fixedTerm,
      // $FlowIgnore -- We have checked this in hasDiscount
      promotion.discountedPrice,
      promotion.numberOfDiscountedPeriods,
      billingPeriod,
      compact,
    );
  }
  return standardRate(glyph, productPrice.price, billingPeriod, productPrice.fixedTerm, compact);
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
