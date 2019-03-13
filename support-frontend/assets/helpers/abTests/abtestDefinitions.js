// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //


export type EditorialiseAmountsVariant = 'control' | 'averageAmount' | 'monthlyBreakdownAnnual' | 'weeklyBreakdownAnnual';

export const tests: Tests = {

  editorialiseAmounts: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'averageAmount',
      },
      {
        id: 'monthlyBreakdownAnnual',
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

