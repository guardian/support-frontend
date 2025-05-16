import type { ContributionType } from 'helpers/contributions';

export enum BillingPeriod {
	Annual = 'Annual',
	Monthly = 'Monthly',
	Quarterly = 'Quarterly',
	OneTime = 'One_Off',
}
export type RegularBillingPeriod =
	| typeof BillingPeriod.Annual
	| typeof BillingPeriod.Monthly
	| typeof BillingPeriod.Quarterly;

export const weeklyBillingPeriods: RegularBillingPeriod[] = [
	BillingPeriod.Monthly,
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
];
export const weeklyGiftBillingPeriods: RegularBillingPeriod[] = [
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
];

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
	ratePlanKey: string | undefined,
): BillingPeriod {
	switch (ratePlanKey) {
		case 'Annual':
		case 'RestOfWorldAnnual':
		case 'DomesticAnnual':
		case 'RestOfWorldAnnualV2':
		case 'DomesticAnnualV2':
			return BillingPeriod.Annual;
		case 'RestOfWorldQuarterly':
		case 'DomesticQuarterly':
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
			return BillingPeriod.Monthly;
		case 'One_Off':
		default:
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
			return undefined; // quarterly has no mapping
	}
}

export function toRegularBillingPeriod(
	regularBillingString: string,
	fallback: RegularBillingPeriod,
): RegularBillingPeriod {
	// for weeklySubscriptionCheckout (to be deprecated)
	const regularBillingPeriods: BillingPeriod[] = [
		BillingPeriod.Annual,
		BillingPeriod.Monthly,
		BillingPeriod.Quarterly,
	];
	if (
		regularBillingPeriods.includes(regularBillingString as RegularBillingPeriod)
	) {
		return regularBillingString as RegularBillingPeriod;
	}

	// for thankyou/checkout mis-matched ratePlan.BillingPeriod (future cleanup)
	const regularBillingPeriod =
		regularBillingString === 'Quarter'
			? BillingPeriod.Quarterly
			: regularBillingString === 'Month'
			? BillingPeriod.Monthly
			: fallback;
	return regularBillingPeriod;
}

// for redux (to be deprecated)
export function contributionTypeToBillingPeriod(
	contributionType: ContributionType,
): BillingPeriod | undefined {
	switch (contributionType) {
		case 'ONE_OFF':
			return BillingPeriod.OneTime;
		case 'MONTHLY':
			return BillingPeriod.Monthly;
		case 'ANNUAL':
			return BillingPeriod.Annual;
		default:
			return undefined;
	}
}
