import type { DigitalBillingPeriod } from "helpers/productPrice/billingPeriods";
import { Monthly } from "helpers/productPrice/billingPeriods";
import type { ProductPrice } from "helpers/productPrice/productPrices";
import { displayPrice, getPriceDescription } from "helpers/productPrice/priceDescriptions";
import { extendedGlyph } from "helpers/internationalisation/currency";
import { getAppliedPromo, hasDiscount, hasIntroductoryPrice } from "helpers/productPrice/promotions";

function hasDiscountOrPromotion(productPrice: ProductPrice) {
  const promotion = getAppliedPromo(productPrice.promotions);
  return hasDiscount(promotion) || hasIntroductoryPrice(promotion);
}

function getBillingDescription(productPrice: ProductPrice, billingPeriod: DigitalBillingPeriod) {
  const glyph = extendedGlyph(productPrice.currency);
  const billingPeriodIsMonthly = billingPeriod === Monthly ? 'every month' : 'a year';
  return hasDiscountOrPromotion(productPrice) ? getPriceDescription(productPrice, billingPeriod) : `A recurring charge of ${displayPrice(glyph, productPrice.price)} ${billingPeriodIsMonthly}`;
}

export { getBillingDescription, hasDiscountOrPromotion };