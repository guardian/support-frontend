import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import {
	getDiscountedPrice,
	getNumberOfDiscountedPeriods,
} from './discountedPrice';

export function getPromotionDiscountedPrice(
	promotion: PromoWithCatalogInformation,
	price: number,
	billingPeriod: RecurringBillingPeriod,
): number | undefined {
	return promotion.discount
		? getDiscountedPrice(price, promotion.discount, billingPeriod)
		: undefined;
}

export function getPromotionDiscountedPeriods(
	promotion: PromoWithCatalogInformation,
	billingPeriod: RecurringBillingPeriod,
): number | undefined {
	return promotion.discount
		? getNumberOfDiscountedPeriods(
				promotion.discount.durationMonths,
				billingPeriod,
		  )
		: undefined;
}
