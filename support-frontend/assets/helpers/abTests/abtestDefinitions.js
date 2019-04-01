// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //


export type EditorialiseAmountsVariant = 'control' | 'dailyBreakdownAnnual' | 'weeklyBreakdownAnnual' | 'notintest';

export const tests: Tests = {

  editorialiseAmounts: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'dailyBreakdownAnnual',
      },
      {
        id: 'weeklyBreakdownAnnual',
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

