// @flow
import type { Tests } from './abtest';
import { annualAmountsLower, annualAmountsFive, annualAmountsOther } from './annualAmountsTest';

// ----- Tests ----- //


export const tests: Tests = {
  ssrTwo: {
    type: 'OTHER',
    variants: [{ id: 'off' }, { id: 'on' }],
    audiences: {
      ALL: {
        offset: 0,
        size: 0,
      },
    },
    isActive: true,
    independent: true,
    seed: 4,
  },

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
