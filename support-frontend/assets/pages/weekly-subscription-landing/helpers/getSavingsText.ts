import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { getDiscountDuration } from 'pages/[countryGroupId]/student/helpers/discountDetails';

export function getWeeklySavingsText(
	promotion: PromoWithCatalogInformation | undefined,
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
	promotion: PromoWithCatalogInformation | undefined,
	allPrices: Partial<Record<RecurringBillingPeriod, number>>,
): string | null {
	if (promotion) {
		return promotion.landingPage?.roundelHtml ?? null;
	}

	// BAU for Annual weekly gifting
	// The goal in here is to display the savings compared to the Quarlerly price
	if (billingPeriod === BillingPeriod.Annual) {
		const annualPrice = allPrices[BillingPeriod.Annual];
		const quarterlyPrice = allPrices[BillingPeriod.Quarterly];

		if (!annualPrice || !quarterlyPrice) {
			return null;
		}
		const quarterlyCostForYear = quarterlyPrice * 4;
		const savingsPercentage = Math.round(
			((quarterlyCostForYear - annualPrice) / quarterlyCostForYear) * 100,
		);

		if (savingsPercentage > 0) {
			return `Save ${savingsPercentage}% with a 12 month gift subscription`;
		}
	}

	return null;
}
