// @flow
import type { Tests } from './abtest';
import { annualAmountsLower, annualAmountsFive, annualAmountsOther } from './annualAmountsTest';

// ----- Tests ----- //

export type FrequencyTabsTestVariant = 'control' | 'sam' | 'mas' | 'notintest';
export type LandingPageCopyTestVariant = 'control' | 'help' | 'notintest';

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

  frequencyTabsOrdering: {
    type: 'OTHER',
    variants: [
      {
        id: 'control', // SMA
      },
      {
        id: 'sam',
      },
      {
        id: 'mas',
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
    seed: 9,
  },

  requiredFields: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'variant',
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
    seed: 5,
  },

  landingPageCopy: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'help',
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
    seed: 12,
  },
};
