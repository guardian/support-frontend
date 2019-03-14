// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //


export type EditorialiseAmountsVariant = 'control' | 'averageAnnualAmount' | 'monthlyBreakdownAnnual' | 'weeklyBreakdownAnnual' | 'notintest';

export const tests: Tests = {

  editorialiseAmounts: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'averageAnnualAmount',
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

