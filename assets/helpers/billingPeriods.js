// @flow

export type Annual = 'Annual';
export type Monthly = 'Monthly';
export type Quarterly = 'Quarterly';
export type SixForSix = 'SixForSix'; // TODO: SixForSix is not a real billing period it's an introductory offer
export type BillingPeriod = SixForSix | Annual | Monthly | Quarterly;
export type DigitalBillingPeriod = Monthly | Annual;
export type WeeklyBillingPeriod = SixForSix | Quarterly | Annual;
export type ContributionBillingPeriod = Monthly | Annual;
