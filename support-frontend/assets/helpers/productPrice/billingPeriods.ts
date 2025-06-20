import type { ContributionType } from 'helpers/contributions';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

export enum BillingPeriod {
	Annual = 'Annual',
	OneYearGift = 'OneYearGift',
	Monthly = 'Monthly',
	Quarterly = 'Quarterly',
	ThreeMonthGift = 'ThreeMonthGift',
	OneTime = 'OneTime',
}

export const weeklyBillingPeriods: BillingPeriod[] = [
	BillingPeriod.Monthly,
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
];
export const weeklyGiftBillingPeriods: BillingPeriod[] = [
	BillingPeriod.ThreeMonthGift,
	BillingPeriod.OneYearGift,
];

/*
  To Remove: awaiting productPrices update to contain Gifting Billing Periods.
  */
export function BillingPeriodNoGift(
	billingPeriod: BillingPeriod,
): BillingPeriod {
	switch (billingPeriod) {
		case BillingPeriod.OneYearGift:
			return BillingPeriod.Annual;
		case BillingPeriod.ThreeMonthGift:
			return BillingPeriod.Quarterly;
		default:
			return billingPeriod;
	}
}

export function getBillingPeriodNoun(
	billingPeriod: BillingPeriod,
	fixedTerm = false,
): string {
	switch (billingPeriod) {
		case BillingPeriod.Annual:
		case BillingPeriod.OneYearGift:
			return fixedTerm ? '12 months' : 'year';
		case BillingPeriod.Quarterly:
		case BillingPeriod.ThreeMonthGift:
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
		case BillingPeriod.OneYearGift:
			return '12 months';
		case BillingPeriod.ThreeMonthGift:
			return '3 months';
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
		case 'RestOfWorldAnnualV2':
		case 'DomesticAnnualV2':
		case 'V1DeprecatedAnnual':
			return BillingPeriod.Annual;
		case 'OneYearGift':
			return BillingPeriod.OneYearGift;
		case 'ThreeMonthGift':
			return BillingPeriod.ThreeMonthGift;
		case 'Quarterly':
			return BillingPeriod.Quarterly;
		case 'Monthly':
		case 'RestOfWorldMonthly':
		case 'DomesticMonthly':
		case 'RestOfWorldMonthlyV2':
		case 'DomesticMonthlyV2':
		case 'Everyday':
		case 'Sixday':
		case 'Weekend':
		case 'Saturday':
		case 'Sunday':
		case 'EverydayPlus':
		case 'SixdayPlus':
		case 'WeekendPlus':
		case 'SaturdayPlus':
		case 'SundayPlus':
		case 'V1DeprecatedMonthly':
			return BillingPeriod.Monthly;
		case 'OneTime':
			return BillingPeriod.OneTime;
	}
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
			return undefined; // gifting & quarterly has no mapping currently
	}
}

export function toRegularBillingPeriod(
	regularBillingString: string | undefined,
): BillingPeriod | undefined {
	if (!regularBillingString) {
		return undefined;
	}

	// for weeklySubscriptionCheckout (to be deprecated)
	const regularBillingPeriods: BillingPeriod[] = [
		BillingPeriod.Annual,
		BillingPeriod.OneYearGift,
		BillingPeriod.Monthly,
		BillingPeriod.Quarterly,
		BillingPeriod.ThreeMonthGift,
	];
	if (regularBillingPeriods.includes(regularBillingString as BillingPeriod)) {
		return regularBillingString as BillingPeriod;
	}

	// exception for thankyou/checkout mis-matched ratePlan.BillingPeriod (future cleanup)
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
