// @flow
import type { Tests } from './abtest';
import { annualAmountsControl, annualAmountsA } from './annualAmountsTest';

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
        amountsRegions: annualAmountsControl,
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
    isActive: false,
    independent: true,
    seed: 3,
  },

};
