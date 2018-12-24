// @flow

const Annual: 'Annual' = 'Annual';
const Monthly: 'Monthly' = 'Monthly';
const Quarterly: 'Quarterly' = 'Quarterly';
const SixForSix: 'SixForSix' = 'SixForSix'; // TODO: SixForSix is not a real billing period it's an introductory offer
export type BillingPeriod = typeof SixForSix | typeof Annual | typeof Monthly | typeof Quarterly;
export type DigitalBillingPeriod = typeof Monthly | typeof Annual;
export type WeeklyBillingPeriod = typeof SixForSix | typeof Quarterly | typeof Annual;
export type ContributionBillingPeriod = typeof Monthly | typeof Annual;

export { Annual, Monthly, Quarterly, SixForSix };
