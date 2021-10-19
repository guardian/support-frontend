import { fixDecimals } from "helpers/productPrice/subscriptions";
import type { BillingPeriod } from "helpers/productPrice/billingPeriods";
import { billingPeriodNoun as upperCaseNoun, billingPeriodAdverb, postIntroductorySixForSixBillingPeriod } from "helpers/productPrice/billingPeriods";
import type { ProductPrice } from "helpers/productPrice/productPrices";
import { glyph as shortGlyph, extendedGlyph } from "helpers/internationalisation/currency";
import type { IntroductoryPriceBenefit } from "helpers/productPrice/promotions";
import type { Promotion } from "helpers/productPrice/promotions";
import { getAppliedPromo, hasDiscount, hasIntroductoryPrice } from "helpers/productPrice/promotions";
import type { Option } from "helpers/types/option";

const displayPrice = (glyph: string, price: number) => `${glyph}${fixDecimals(price)}`;

const billingPeriodQuantifier = (numberOfBillingPeriods: number, noun: string, fixedTerm: boolean) => {
  if (fixedTerm) {
    return ` for ${noun}`;
  }

  return numberOfBillingPeriods > 1 ? `/${noun} for ${numberOfBillingPeriods} ${noun}s` : ` for 1 ${noun}`;
};

const billingPeriodNoun = (billingPeriod: BillingPeriod, fixedTerm: boolean = false) => upperCaseNoun(billingPeriod, fixedTerm).toLowerCase();

const standardRate = (glyph: string, price: number, billingPeriod: BillingPeriod, fixedTerm: boolean) => {
  const termPrepositon = fixedTerm ? 'for' : 'per';
  return `${displayPrice(glyph, price)} ${termPrepositon} ${billingPeriodNoun(billingPeriod, fixedTerm)}`;
};

const getStandardRateCopy = (glyph: string, price: number, billingPeriod: BillingPeriod, fixedTerm: boolean) => {
  if (fixedTerm) {
    return '';
  }

  const standard = standardRate(glyph, price, billingPeriod, fixedTerm);
  return `, then ${standard}`;
};

function getDiscountDescription(glyph: string, price: number, fixedTerm: boolean, discountedPrice: number, numberOfDiscountedPeriods: number | null | undefined, billingPeriod: BillingPeriod) {
  const noun = billingPeriodNoun(billingPeriod, fixedTerm);

  if (numberOfDiscountedPeriods) {
    const discountCopy = `You'll pay ${displayPrice(glyph, discountedPrice)}${billingPeriodQuantifier(numberOfDiscountedPeriods, noun, fixedTerm)}`;
    const standardCopy = getStandardRateCopy(glyph, price, billingPeriod, fixedTerm);
    return `${discountCopy}${standardCopy}`;
  }

  return '';
}

const pluralizePeriodType = (numberOfPeriods: number, periodType: string) => numberOfPeriods > 1 ? `${periodType}s` : periodType;

const getIntroductoryPriceDescription = (glyph: string, introPrice: IntroductoryPriceBenefit, productPrice: ProductPrice, compact: boolean) => {
  const standardCopy = standardRate(glyph, productPrice.price, postIntroductorySixForSixBillingPeriod, productPrice.fixedTerm);
  const separator = compact ? '/' : ' for the first ';
  const periodType = pluralizePeriodType(introPrice.periodLength, introPrice.periodType);
  return `${glyph}${introPrice.price}${separator}${introPrice.periodLength} ${periodType} (then ${standardCopy})`;
};

function getPriceDescription(productPrice: ProductPrice, billingPeriod: BillingPeriod, compact: boolean = false, useExtendedGlyph: boolean = true): string {
  const glyphFn = useExtendedGlyph ? extendedGlyph : shortGlyph;
  const glyph = glyphFn(productPrice.currency);
  const promotion = getAppliedPromo(productPrice.promotions);

  if (hasIntroductoryPrice(promotion)) {
    return getIntroductoryPriceDescription(glyph, // $FlowIgnore -- We have checked this in hasIntroductoryPrice
    promotion.introductoryPrice, productPrice, compact);
  }

  if (hasDiscount(promotion)) {
    return getDiscountDescription(glyph, productPrice.price, productPrice.fixedTerm, // $FlowIgnore -- We have checked this in hasDiscount
    promotion.discountedPrice, promotion.numberOfDiscountedPeriods, billingPeriod);
  }

  return standardRate(glyph, productPrice.price, billingPeriod, productPrice.fixedTerm);
}

function getAppliedPromoDescription(billingPeriod: BillingPeriod, productPrice: ProductPrice) {
  const appliedPromo = getAppliedPromo(productPrice.promotions);

  if (appliedPromo && appliedPromo.landingPage && appliedPromo.landingPage.roundel) {
    return appliedPromo.landingPage.roundel;
  }

  return '';
}

function getSimplifiedPriceDescription(productPrice: ProductPrice, billingPeriod: BillingPeriod) {
  const glyph = extendedGlyph(productPrice.currency);
  const promotion = getAppliedPromo(productPrice.promotions);
  const termPrepositon = productPrice.fixedTerm ? 'for' : 'per';

  if (promotion && promotion.introductoryPrice) {
    const introPrice = promotion.introductoryPrice;
    const standardCopy = standardRate(glyph, productPrice.price, postIntroductorySixForSixBillingPeriod, productPrice.fixedTerm);
    const periodType = pluralizePeriodType(introPrice.periodLength, introPrice.periodType);
    return `for ${introPrice.periodLength} ${periodType} (then ${standardCopy})`;
  }

  if (promotion && promotion.discountedPrice) {
    const standardCopy = getStandardRateCopy(glyph, productPrice.price, billingPeriod, productPrice.fixedTerm);
    return `${termPrepositon} ${billingPeriodNoun(billingPeriod, productPrice.fixedTerm)}${standardCopy}`;
  }

  return `${termPrepositon} ${billingPeriodNoun(billingPeriod, productPrice.fixedTerm)}`;
}

function getPriceForDescription(productPrice: ProductPrice, promotion: Option<Promotion>) {
  if (promotion && promotion.introductoryPrice) {
    return promotion.introductoryPrice.price;
  }

  if (promotion && promotion.discountedPrice) {
    return promotion.discountedPrice;
  }

  return productPrice.price;
}

function getAdverbialSubscriptionDescription(productPrice: ProductPrice, billingPeriod: BillingPeriod) {
  const glyph = shortGlyph(productPrice.currency);
  const promotion = getAppliedPromo(productPrice.promotions);
  const price = getPriceForDescription(productPrice, promotion);
  return `Subscribe ${billingPeriodAdverb(billingPeriod).toLowerCase()} for ${displayPrice(glyph, price)}`;
}

export { displayPrice, getPriceDescription, getAppliedPromoDescription, getSimplifiedPriceDescription, getAdverbialSubscriptionDescription };