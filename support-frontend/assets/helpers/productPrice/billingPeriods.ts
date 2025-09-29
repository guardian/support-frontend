import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ContributionType } from 'helpers/contributions';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

export const weeklyBillingPeriods: RecurringBillingPeriod[] = [
	BillingPeriod.Monthly,
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
];
export const weeklyGiftBillingPeriods: RecurringBillingPeriod[] = [
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
];

export function billingPeriodToRatePlan(
	billingPeriod: BillingPeriod,
	isWeeklyGifting: boolean,
): string {
	if (isWeeklyGifting) {
		return billingPeriod === BillingPeriod.Annual
			? 'OneYearGift'
			: 'ThreeMonthGift';
	}
	return billingPeriod.toString();
}

export function getBillingPeriodNoun(
	billingPeriod: BillingPeriod,
	fixedTerm = false,
): string {
	switch (billingPeriod) {
		case BillingPeriod.Annual:
			return fixedTerm ? '12 months' : 'year';
		case BillingPeriod.Quarterly:
			return fixedTerm ? '3 months' : 'quarter';
		case BillingPeriod.OneTime:
			return 'one-time';
		default:
			return 'month';
	}
}

export function getBillingPeriodTitle(
	billingPeriod: BillingPeriod,
	fixedTerm = false,
): string {
	switch (billingPeriod) {
		case BillingPeriod.Annual:
			return fixedTerm ? '12 months' : billingPeriod;

		case BillingPeriod.Quarterly:
			return fixedTerm ? '3 months' : billingPeriod;

		case BillingPeriod.OneTime:
			return 'One-time';

		default:
			return billingPeriod;
	}
}

export function ratePlanToBillingPeriod(
	ratePlanKey: ActiveRatePlanKey,
): BillingPeriod {
	switch (ratePlanKey) {
		case 'Annual':
		case 'RestOfWorldAnnual':
		case 'DomesticAnnual':
		case 'OneYearGift':
		case 'OneYearStudent':
		case 'V1DeprecatedAnnual':
			return BillingPeriod.Annual;
		case 'ThreeMonthGift':
		case 'Quarterly':
			return BillingPeriod.Quarterly;
		case 'Monthly':
		case 'RestOfWorldMonthly':
		case 'DomesticMonthly':
		case 'Everyday':
		case 'Sixday':
		case 'Weekend':
		case 'Saturday':
		case 'Sunday':
		case 'EverydayPlus':
		case 'SixdayPlus':
		case 'WeekendPlus':
		case 'SaturdayPlus':
		case 'V1DeprecatedMonthly':
			return BillingPeriod.Monthly;
		case 'OneTime':
			return BillingPeriod.OneTime;
	}
	throw new Error('Unsupported rate plan key: ' + ratePlanKey);
}

export function billingPeriodToContributionType(
	billingPeriod: BillingPeriod,
): ContributionType | undefined {
	switch (billingPeriod) {
		case BillingPeriod.OneTime:
			return 'ONE_OFF';
		case BillingPeriod.Monthly:
			return 'MONTHLY';
		case BillingPeriod.Annual:
			return 'ANNUAL';
		default:
			return undefined; // quarterly has no mapping
	}
}

export function toRegularBillingPeriod(
	regularBillingString: string | undefined,
): RecurringBillingPeriod | undefined {
	if (!regularBillingString) {
		return undefined;
	}

	// for weeklySubscriptionCheckout (to be deprecated)
	const regularBillingPeriods: BillingPeriod[] = [
		BillingPeriod.Annual,
		BillingPeriod.Monthly,
		BillingPeriod.Quarterly,
	];
	if (
		regularBillingPeriods.includes(
			regularBillingString as RecurringBillingPeriod,
		)
	) {
		return regularBillingString as RecurringBillingPeriod;
	}

	// // for thankyou/checkout mis-matched ratePlan.BillingPeriod (future cleanup)
	if (regularBillingString === 'Quarter') {
		return BillingPeriod.Quarterly;
	}
	if (regularBillingString === 'Month') {
		return BillingPeriod.Monthly;
	}
	return undefined;
}

// for redux (to be deprecated)
export function contributionTypeToBillingPeriod(
	contributionType: ContributionType,
): BillingPeriod {
	switch (contributionType) {
		case 'ONE_OFF':
			return BillingPeriod.OneTime;
		case 'MONTHLY':
			return BillingPeriod.Monthly;
		case 'ANNUAL':
			return BillingPeriod.Annual;
	}
}
