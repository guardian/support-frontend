// @flow

import { fixDecimals } from 'helpers/subscriptions';
import type { BillingPeriod } from 'helpers/billingPeriods';
import {
  billingPeriodNoun,
  Quarterly,
  SixWeekly,
} from 'helpers/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import {
  getAppliedPromo,
  hasDiscount,
} from 'helpers/productPrice/productPrices';

const displayPrice = (glyph: string, price: number) => `${glyph}${fixDecimals(price)}`;

const billingPeriodQuantifier = (numberOfBillingPeriods: number, noun: string) =>
  (numberOfBillingPeriods > 1 ?
    `/${noun} for ${numberOfBillingPeriods} ${noun}s` :
    ` for 1 ${noun}`);

const billingPeriodDescription = (billingPeriod: BillingPeriod) =>
  ((billingPeriod === Quarterly) ? '3 months' : billingPeriodNoun(billingPeriod).toLowerCase());

const standardRate = (glyph: string, price: number, billingPeriod: BillingPeriod) => `${displayPrice(glyph, price)} every ${billingPeriodDescription(billingPeriod)}`;

function getDiscountDescription(
  glyph: string,
  price: number,
  discountedPrice: number,
  numberOfDiscountedPeriods: ?number,
  billingPeriod: BillingPeriod,
) {
  const noun = billingPeriodDescription(billingPeriod);

  if (numberOfDiscountedPeriods) {
    const discountCopy = `${displayPrice(glyph, discountedPrice)}${billingPeriodQuantifier(numberOfDiscountedPeriods, noun)}`;
    const standardCopy = `then standard rate (${standardRate(glyph, price, billingPeriod)})`;
    return `${discountCopy}, ${standardCopy}`;
  }

  return '';
}

// This function requires the Quarterly price to be passed into it, we can
// remove it completely once we make 6 for 6 a promotion
function getSixForSixDescription(glyph: string, productPrice: ProductPrice) {
  return `${glyph}6 for the first 6 issues (then ${standardRate(glyph, productPrice.price, Quarterly)})`;
}

function getPriceDescription(
  glyph: string,
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
): string {
  if (billingPeriod === SixWeekly) {
    return getSixForSixDescription(glyph, productPrice);
  }
  const promotion = getAppliedPromo(productPrice.promotions);
  return hasDiscount(promotion) ? getDiscountDescription(
    glyph,
    productPrice.price,
    // $FlowIgnore -- We have checked this in hasDiscount
    promotion.discountedPrice,
    promotion.numberOfDiscountedPeriods,
    billingPeriod,
  ) : standardRate(glyph, productPrice.price, billingPeriod);
}

function getAppliedPromoDescription(billingPeriod: BillingPeriod, productPrice: ProductPrice) {
  const appliedPromo = getAppliedPromo(productPrice.promotions);
  if (
    appliedPromo === null ||
    (appliedPromo.introductoryPrice && billingPeriod === Quarterly)
  ) {
    return '';
  }

  return appliedPromo.description;
}


export { getPriceDescription, getAppliedPromoDescription };
