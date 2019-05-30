// @flow

const Annual: 'Annual' = 'Annual';
const Monthly: 'Monthly' = 'Monthly';
const Quarterly: 'Quarterly' = 'Quarterly';
const SixForSix: 'SixForSix' = 'SixForSix';
const ActiveWeeklyProductTypes = [Quarterly, Annual, SixForSix];
export type BillingPeriod = typeof SixForSix | typeof Annual | typeof Monthly | typeof Quarterly;
export type DigitalBillingPeriod = typeof Monthly | typeof Annual;
export type WeeklyBillingPeriod = typeof SixForSix | typeof Quarterly | typeof Annual;
export type ContributionBillingPeriod = typeof Monthly | typeof Annual;

function billingPeriodNoun(billingPeriod: BillingPeriod) {
  switch (billingPeriod) {
    case Annual:
      return 'Year';
    case Quarterly:
      return 'Quarter';
    case SixForSix:
      return 'Six issues';
    default:
      return 'Month';
  }
}

export { Annual, Monthly, Quarterly, SixForSix, billingPeriodNoun, ActiveWeeklyProductTypes };
