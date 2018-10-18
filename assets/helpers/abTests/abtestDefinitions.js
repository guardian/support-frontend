// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export type AnnualContributionsTestVariant = 'control' | 'annual' | 'annualHigherAmounts' | 'notintest';


export const existingContributionsFlowTests: Tests = {
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
  newPaymentFlow: {
    variants: ['control'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    // TODO: turn to false
    isActive: true,
    independent: true,
    seed: 4,
  },
};

export const newContributionsFlowTests: Tests = {
  newPaymentFlow: {
    variants: ['newPaymentFlow'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    // TODO: turn to false
    isActive: true,
    independent: true,
    seed: 5,
  },
};

export const allTests: Tests = {
  ...existingContributionsFlowTests,
  ...newContributionsFlowTests,
  // add any other tests here
};
