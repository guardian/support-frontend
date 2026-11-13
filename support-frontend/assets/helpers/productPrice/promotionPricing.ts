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
): number {
	return promotion.discount && billingPeriod !== BillingPeriod.OneTime
		? getDiscountedPrice(price, promotion.discount, billingPeriod)
		: price;
}

export function getPromotionDiscountedPeriods(
	promotion: PromoWithCatalogInformation,
	billingPeriod: BillingPeriod,
): number {
	return promotion.discount && billingPeriod !== BillingPeriod.OneTime
		? getNumberOfDiscountedPeriods(
				promotion.discount.durationMonths,
				billingPeriod,
		  )
		: 0;
}
