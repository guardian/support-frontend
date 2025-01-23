const Annual = 'Annual';
const Monthly = 'Monthly';
const Quarterly = 'Quarterly';

export type BillingPeriod = typeof Annual | typeof Monthly | typeof Quarterly;

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

function billingPeriodAdverb(billingPeriod: BillingPeriod): string {
	switch (billingPeriod) {
		case Annual:
			return 'Annually';

		case Quarterly:
			return 'Quarterly';

		default:
			return 'Monthly';
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

export {
	Annual,
	Monthly,
	Quarterly,
	billingPeriodNoun,
	billingPeriodAdverb,
	billingPeriodTitle,
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
};
