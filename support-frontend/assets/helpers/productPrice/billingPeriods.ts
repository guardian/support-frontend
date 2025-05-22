import type { ContributionType } from 'helpers/contributions';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

export enum BillingPeriod {
	Annual = 'Annual',
	Monthly = 'Monthly',
	Quarterly = 'Quarterly',
	OneTime = 'OneTime',
}
export type RecurringBillingPeriod =
	| typeof BillingPeriod.Annual
	| typeof BillingPeriod.Monthly
	| typeof BillingPeriod.Quarterly;

export const weeklyBillingPeriods: RecurringBillingPeriod[] = [
	BillingPeriod.Monthly,
	BillingPeriod.Quarterly,
	BillingPeriod.Annual,
];
export const weeklyGiftBillingPeriods: RecurringBillingPeriod[] = [
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
	ratePlanKey: ActiveRatePlanKey,
): BillingPeriod {
	switch (ratePlanKey) {
		case 'Annual':
		case 'RestOfWorldAnnual':
		case 'DomesticAnnual':
		case 'RestOfWorldAnnualV2':
		case 'DomesticAnnualV2':
		case 'OneYearGift':
		case 'V1DeprecatedAnnual':
			return BillingPeriod.Annual;
		case 'ThreeMonthGift':
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
		case 'Everyday+':
		case 'Sixday+':
		case 'Weekend+':
		case 'Saturday+':
		case 'Sunday+':
		case 'V1DeprecatedMonthly':
		case 'GuardianPatron':
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
