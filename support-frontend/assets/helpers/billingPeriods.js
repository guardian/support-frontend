// @flow

import { SixWeekly } from 'helpers/billingPeriods_REMOTE_80836';

const Annual: 'Annual' = 'Annual';
const Monthly: 'Monthly' = 'Monthly';
const Quarterly: 'Quarterly' = 'Quarterly';
const SixWeekly: 'SixWeekly' = 'SixWeekly'; // TODO: SixWeekly is not a real billing period it's an introductory offer
export type BillingPeriod = typeof SixWeekly | typeof Annual | typeof Monthly | typeof Quarterly;
export type DigitalBillingPeriod = typeof Monthly | typeof Annual;
export type WeeklyBillingPeriod = typeof SixWeekly | typeof Quarterly | typeof Annual;
export type ContributionBillingPeriod = typeof Monthly | typeof Annual;

function billingPeriodNoun(billingPeriod: BillingPeriod) {
  switch (billingPeriod) {
    case Annual:
      return 'Year';
    case Quarterly:
      return 'Quarter';
    case SixWeekly:
      return 'Six issues';
    default:
      return 'Month';
  }
}

export { Annual, Monthly, Quarterly, SixWeekly, billingPeriodNoun };
