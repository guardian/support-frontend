import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getAppliedPromotion } from './appliedPromotion';
import {
	getDiscountedPrice,
	getNumberOfDiscountedPeriods,
} from './discountedPrice';
import type { Promotion } from './promotions';

/**
 * Converts a promotion from promotions-api into the legacy `Promotion` shape
 * which was previously served in `window.guardian.allProductPrices`.
 */
export function toLegacyPromotion(
	promotion: PromoWithCatalogInformation,
	price: number,
	billingPeriod: RecurringBillingPeriod,
): Promotion {
	const { discount, landingPage } = promotion;
	return {
		name: promotion.name,
		description: promotion.description ?? '',
		promoCode: promotion.promoCode,
		isIntroductoryPricing: promotion.isIntroductoryPricing ?? false,
		discountedPrice: discount
			? getDiscountedPrice(price, discount, billingPeriod)
			: undefined,
		numberOfDiscountedPeriods: discount
			? getNumberOfDiscountedPeriods(discount.durationMonths, billingPeriod)
			: undefined,
		discount,
		landingPage: landingPage && {
			title: landingPage.title,
			description: landingPage.description,
			roundel: landingPage.roundelHtml,
		},
		starts: promotion.startTimestamp,
		expires: promotion.endTimestamp,
	};
}

/**
 * Gets the promotion to apply to a rate plan in the legacy `Promotion` shape.
 */
export function getLegacyPromotion({
	promotions,
	productKey,
	ratePlanKey,
	price,
	billingPeriod,
	promoCode,
}: {
	promotions: PromoWithCatalogInformation[];
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	price: number;
	billingPeriod: RecurringBillingPeriod;
	promoCode?: string;
}): Promotion | undefined {
	const promotion = getAppliedPromotion(
		promotions,
		productKey,
		ratePlanKey,
		promoCode,
	);
	return promotion && toLegacyPromotion(promotion, price, billingPeriod);
}
