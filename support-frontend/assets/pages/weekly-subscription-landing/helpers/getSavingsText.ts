import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getDiscountDuration } from 'pages/[countryGroupId]/student/helpers/discountDetails';

export function getWeeklySavingsText(
	promotion: Promotion | undefined,
): string | null {
	const durationInMonths = promotion?.discount?.durationMonths;

	if (!durationInMonths) {
		return null;
	}

	return `Save ${promotion.discount?.amount}% for ${getDiscountDuration({
		durationInMonths,
	})}`;
}

export function getWeeklyGiftSavingsText(
	billingPeriod: RecurringBillingPeriod,
	promotion: Promotion | undefined,
	allPrices: Partial<Record<RecurringBillingPeriod, ProductPrice>>,
): string | null {
	if (promotion) {
		return promotion.landingPage?.roundel ?? null;
	}

	// BAU for Annual weekly gifting
	// The goal in here is to display the savings compared to the Quarlerly price
	if (billingPeriod === BillingPeriod.Annual) {
		const annualPrice = allPrices[BillingPeriod.Annual]?.price;
		const quarterlyPrice = allPrices[BillingPeriod.Quarterly]?.price;

		if (!annualPrice || !quarterlyPrice) {
			return null;
		}

		const savingsVsQuarterly = quarterlyPrice * 4 - annualPrice;
		const savingsPercentage = Math.round(
			(savingsVsQuarterly / quarterlyPrice) * 100,
		);

		if (savingsPercentage > 0) {
			return `Save an extra ${savingsPercentage}% on a 12 month gift subscription`;
		}
	}

	return null;
}
