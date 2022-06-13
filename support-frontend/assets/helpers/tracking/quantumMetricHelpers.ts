import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';

export const getAnnualValue = (
	productPrice: ProductPrice,
	billingPeriod: BillingPeriod,
): number | undefined => {
	const fullPrice = productPrice.price;
	const promotion = getAppliedPromo(productPrice.promotions);

	const periodMultipliers: Record<BillingPeriod, number> = {
		Annual: 1,
		Monthly: 12,
		Quarterly: 4,
		SixWeekly: 0,
	};

	const periodMultiplier = periodMultipliers[billingPeriod];

	/**
	 * This catches the event that the SixWeekly BillingPeriod is used
	 * and returns immediately. We shouldn't have to handle at runtime as the SixWeekly billing
	 * period is deprecated. We should look into whether we want to retain/remove logic
	 * to handle it in our code.
	 */
	if (periodMultiplier === 0) {
		return;
	}

	const fullPriceInPenceCents = fullPrice * 100;
	const fullAnnualPrice =
		fullPriceInPenceCents * (productPrice.fixedTerm ? 1 : periodMultiplier);

	if (!promotion?.discountedPrice || !promotion.numberOfDiscountedPeriods) {
		return fullAnnualPrice;
	}

	const discountedPriceInPenceCents = promotion.discountedPrice * 100;
	const discountInPenceCents =
		fullPriceInPenceCents - discountedPriceInPenceCents;

	const discountedAnnualPrice =
		fullAnnualPrice -
		discountInPenceCents * promotion.numberOfDiscountedPeriods;

	return discountedAnnualPrice;
};
