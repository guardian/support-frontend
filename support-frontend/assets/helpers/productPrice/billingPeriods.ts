const Annual = 'Annual';
const Monthly = 'Monthly';
const Quarterly = 'Quarterly';
const SixWeekly = 'SixWeekly';

// The value for six for six billing period here must match
// the value in support-models/src/main/scala/com/gu/support/catalog/Product.scala
const postIntroductorySixForSixBillingPeriod = 'Monthly';

export type BillingPeriod =
	| typeof SixWeekly
	| typeof Annual
	| typeof Monthly
	| typeof Quarterly;

export type WeeklyBillingPeriod =
	| typeof SixWeekly
	| typeof Monthly
	| typeof Quarterly
	| typeof Annual;

export type ContributionBillingPeriod = typeof Monthly | typeof Annual;

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

		case SixWeekly:
			return 'Six issues';

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

		case SixWeekly:
			return '6 for 6';

		default:
			return billingPeriod;
	}
}

export {
	Annual,
	Monthly,
	Quarterly,
	SixWeekly,
	postIntroductorySixForSixBillingPeriod,
	billingPeriodNoun,
	billingPeriodAdverb,
	billingPeriodTitle,
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
};
