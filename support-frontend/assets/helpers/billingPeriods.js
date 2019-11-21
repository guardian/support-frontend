// @flow

const Annual: 'Annual' = 'Annual';
const Monthly: 'Monthly' = 'Monthly';
const Quarterly: 'Quarterly' = 'Quarterly';
const SixWeekly: 'SixWeekly' = 'SixWeekly';
const weeklyBillingPeriods = [SixWeekly, Quarterly, Annual];
export type BillingPeriod = typeof SixWeekly | typeof Annual | typeof Monthly | typeof Quarterly;
export type DigitalBillingPeriod = typeof Monthly | typeof Annual;
export type WeeklyBillingPeriod = typeof SixWeekly | typeof Quarterly | typeof Annual;

export type ContributionBillingPeriod = typeof Monthly | typeof Annual;

function billingPeriodNoun(billingPeriod: BillingPeriod, fixedTerm: boolean = false) {
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

function billingPeriodTitle(billingPeriod: BillingPeriod, fixedTerm: boolean = false) {
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
  billingPeriodNoun,
  billingPeriodTitle,
  weeklyBillingPeriods,
};
