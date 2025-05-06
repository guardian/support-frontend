import type { ContributionType } from 'helpers/contributions';

const Annual = 'Annual';
const Monthly = 'Monthly';
const Quarterly = 'Quarterly';
const OneTime = 'One_Off';

export type BillingPeriod =
	| typeof Annual
	| typeof Monthly
	| typeof Quarterly
	| typeof OneTime;

export type WeeklyBillingPeriod =
	| typeof Monthly
	| typeof Quarterly
	| typeof Annual;

const weeklyBillingPeriods = (): WeeklyBillingPeriod[] => {
	return [Monthly, Quarterly, Annual];
};

const weeklyGiftBillingPeriods: WeeklyBillingPeriod[] = [Quarterly, Annual];

function billingPeriodNoun(
	billingPeriod: BillingPeriod,
	fixedTerm = false,
): string {
	switch (billingPeriod) {
		case Annual:
			return fixedTerm ? '12 months' : 'Year';

		case Quarterly:
			return fixedTerm ? '3 months' : 'Quarter';

		default:
			return 'Month';
	}
}

function billingPeriodTitle(
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

function ratePlanToBillingPeriod(
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
  Awaiting 2-step checkout fully deprecation
*/
function contributionTypeToBillingPeriod(
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

export {
	Annual,
	Monthly,
	Quarterly,
	billingPeriodNoun,
	billingPeriodTitle,
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
	ratePlanToBillingPeriod,
	contributionTypeToBillingPeriod,
};
