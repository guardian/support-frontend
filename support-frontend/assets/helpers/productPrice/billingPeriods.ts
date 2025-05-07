import type { ContributionType } from 'helpers/contributions';

export const Annual = 'Annual';
export const Monthly = 'Monthly';
export const Quarterly = 'Quarterly';
export const OneTime = 'One_Off';

export type BillingPeriod = RegularBillingPeriod | OneTimeBillingPeriod;
export type RegularBillingPeriod =
	| typeof Annual
	| typeof Monthly
	| typeof Quarterly;
type OneTimeBillingPeriod = typeof OneTime;

export const weeklyBillingPeriods: RegularBillingPeriod[] = [
	Monthly,
	Quarterly,
	Annual,
];
export const weeklyGiftBillingPeriods: RegularBillingPeriod[] = [
	Quarterly,
	Annual,
];

export function billingPeriodNoun(
	billingPeriod: BillingPeriod,
	fixedTerm = false,
): string {
	switch (billingPeriod) {
		case Annual:
			return fixedTerm ? '12 months' : 'year';
		case Quarterly:
			return fixedTerm ? '3 months' : 'quarter';
		default:
			return 'month';
	}
}

export function billingPeriodTitle(
	billingPeriod: BillingPeriod,
	fixedTerm = false,
): string {
	switch (billingPeriod) {
		case Annual:
			return fixedTerm ? '12 months' : billingPeriod;

		case Quarterly:
			return fixedTerm ? '3 months' : billingPeriod;

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
			return Annual;
		case 'RestOfWorldQuarterly':
		case 'DomesticQuarterly':
			return Quarterly;
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
			return Monthly;
		default:
			return OneTime;
	}
}

/*
  Awaiting 2-step checkout full deprecation
*/
export function toRegularBillingPeriod(
	regularBillingString: string,
	fallback: RegularBillingPeriod,
): RegularBillingPeriod {
	const regularBillingPeriods: BillingPeriod[] = [Annual, Monthly, Quarterly];
	if (
		regularBillingPeriods.includes(regularBillingString as RegularBillingPeriod)
	) {
		return regularBillingString as RegularBillingPeriod;
	}
	const regularBillingPeriod =
		regularBillingString === 'Quarter'
			? Quarterly
			: regularBillingString === 'Month'
			? Monthly
			: fallback;
	return regularBillingPeriod;
}
export function contributionTypeToBillingPeriod(
	contributionType: ContributionType,
): BillingPeriod | undefined {
	switch (contributionType) {
		case 'ONE_OFF':
			return OneTime;
		case 'MONTHLY':
			return Monthly;
		case 'ANNUAL':
			return Annual;
		default:
			return undefined;
	}
}
export function billingPeriodToContributionType(
	billingPeriod: BillingPeriod,
): ContributionType | undefined {
	switch (billingPeriod) {
		case OneTime:
			return 'ONE_OFF';
		case Monthly:
			return 'MONTHLY';
		case Annual:
			return 'ANNUAL';
		default:
			return undefined;
	}
}
