// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export type AnnualContributionsTestVariant = 'control' | 'annual' | 'annualHigherAmounts' | 'notintest';

export const tests: Tests = {
  annualContributionsRoundTwo: {
    variants: ['control', 'annual', 'annualHigherAmounts'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 3,
  },
  recurringGuestCheckoutRoundTwo: {
    variants: ['control', 'guest'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independent: true,
    seed: 4,
  },
};
