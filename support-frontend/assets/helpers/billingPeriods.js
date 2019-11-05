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

function billingPeriodNoun(billingPeriod: BillingPeriod, orderIsAGift: boolean = false) {
  switch (billingPeriod) {
    case Annual:
      return orderIsAGift ? 'A year' : 'Year';
    case Quarterly:
      return orderIsAGift ? '3 months' : 'Quarter';
    case SixWeekly:
      return 'Six issues';
    default:
      return 'Month';
  }
}

function billingPeriodTitle(billingPeriod: BillingPeriod) {
  if (billingPeriod === SixWeekly) { return '6 for 6'; }
  return billingPeriod;
}

export { Annual, Monthly, Quarterly, SixWeekly, billingPeriodNoun, billingPeriodTitle, weeklyBillingPeriods };
