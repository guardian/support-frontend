import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { DigitalBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import {
	displayPrice,
	getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';

function hasDiscountOrPromotion(productPrice: ProductPrice): boolean {
	const promotion = getAppliedPromo(productPrice.promotions);
	return hasDiscount(promotion);
}

function getBillingDescription(
	productPrice: ProductPrice,
	billingPeriod: DigitalBillingPeriod,
): string {
	const glyph = extendedGlyph(productPrice.currency);
	const billingPeriodIsMonthly =
		billingPeriod === Monthly ? 'every month' : 'a year';
	return hasDiscountOrPromotion(productPrice)
		? getPriceDescription(productPrice, billingPeriod)
		: `A recurring charge of ${displayPrice(
				glyph,
				productPrice.price,
		  )} ${billingPeriodIsMonthly}`;
}

export { getBillingDescription, hasDiscountOrPromotion };
