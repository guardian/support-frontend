// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //


export type EditorialiseAmountsVariant = 'control' | 'dailyBreakdownAnnual' | 'weeklyBreakdownAnnual' | 'notintest';
export type VerticalContributionsTabsVariant = 'control' | 'verticalTabsMobile' | 'notintest';

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

  verticalContributionsTabs: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'verticalTabsMobile',
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
    seed: 4,
  },
};

