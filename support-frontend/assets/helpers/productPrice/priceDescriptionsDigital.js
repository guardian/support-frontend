// @flow

import { Monthly, type DigitalBillingPeriod } from 'helpers/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
// import type { IsoCountry } from 'helpers/internationalisation/country';
import { displayPrice, getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import {
  getAppliedPromo,
  hasDiscount,
  hasIntroductoryPrice,
} from 'helpers/productPrice/promotions';

function hasDiscountOrPromotion(productPrice: ProductPrice) {
  const promotion = getAppliedPromo(productPrice.promotions);
  return hasDiscount(promotion) || hasIntroductoryPrice(promotion);
}

function getBillingDescription(
  productPrice: ProductPrice,
  billingPeriod: DigitalBillingPeriod,
) {
  const glyph = extendedGlyph(productPrice.currency);

  if (billingPeriod === Monthly) {
    return hasDiscountOrPromotion(productPrice)
      ? getPriceDescription(productPrice, billingPeriod)
      : `A recurring charge of ${displayPrice(glyph, productPrice.price)} every month`;
  }
  return hasDiscountOrPromotion(productPrice)
    ? getPriceDescription(productPrice, billingPeriod)
    : `You'll pay ${displayPrice(glyph, productPrice.price)}/year`;
}

export {
  getBillingDescription,
  hasDiscountOrPromotion,
};
