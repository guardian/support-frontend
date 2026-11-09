import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import {
	getDiscountedPrice,
	getNumberOfDiscountedPeriods,
} from './discountedPrice';

export function getPromotionDiscountedPrice(
	promotion: PromoWithCatalogInformation,
	price: number,
	billingPeriod: BillingPeriod,
): number | undefined {
	return promotion.discount && billingPeriod !== BillingPeriod.OneTime
		? getDiscountedPrice(price, promotion.discount, billingPeriod)
		: undefined;
}

export function getPromotionDiscountedPeriods(
	promotion: PromoWithCatalogInformation,
	billingPeriod: BillingPeriod,
): number | undefined {
	return promotion.discount && billingPeriod !== BillingPeriod.OneTime
		? getNumberOfDiscountedPeriods(
				promotion.discount.durationMonths,
				billingPeriod,
		  )
		: undefined;
}
