// @flow
import type { Tests } from './abtest';
import { annualAmountsLower, annualAmountsFive, annualAmountsOther } from './annualAmountsTest';

// ----- Tests ----- //

export const tests: Tests = {

  annualContributionsRoundFour: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'lower',
        amountsRegions: annualAmountsLower,
      },
      {
        id: 'five',
        amountsRegions: annualAmountsFive,
      },
      {
        id: 'other',
        amountsRegions: annualAmountsOther,
      },
    ],
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
};
