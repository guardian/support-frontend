import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import {
	getDiscountedPrice,
	getNumberOfDiscountedPeriods,
} from './discountedPrice';

/**
 * The price per billing period while the promotion's discount applies,
 * or undefined if the promotion has no discount.
 */
export function getPromotionDiscountedPrice(
	promotion: Pick<PromoWithCatalogInformation, 'discount'>,
	price: number,
	billingPeriod: RecurringBillingPeriod,
): number | undefined {
	return promotion.discount
		? getDiscountedPrice(price, promotion.discount, billingPeriod)
		: undefined;
}

/**
 * The number of billing periods the promotion's discount applies for,
 * or undefined if the promotion has no discount.
 */
export function getPromotionDiscountedPeriods(
	promotion: Pick<PromoWithCatalogInformation, 'discount'>,
	billingPeriod: RecurringBillingPeriod,
): number | undefined {
	return promotion.discount
		? getNumberOfDiscountedPeriods(
				promotion.discount.durationMonths,
				billingPeriod,
		  )
		: undefined;
}
