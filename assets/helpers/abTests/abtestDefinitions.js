// @flow
import type { Tests } from './abtest';
import { annualAmountsA } from './annualAmountsTest';

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
        id: 'annualAmountsA',
        amountsRegions: annualAmountsA,
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
