// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //


export type EditorialiseAmountsRoundTwoVariant = 'control' | 'weeklyBreakdownMonthlyAsWell' | 'notintest';

export const tests: Tests = {

  editorialiseAmountsRoundTwo: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'weeklyBreakdownMonthlyAsWell',
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

