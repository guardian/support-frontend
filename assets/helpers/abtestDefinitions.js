// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  addAnnualContributions: {
    variants: ['control', 'variant'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
  },

  digipackFlowOptimisationTest: {
    variants: ['control', 'variant'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independence: 1,
  },

  headerCopyTest: {
    variants: ['control', 'howAndWhy', 'numberOfSupporters'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independence: 2,
  },

  usRecurringCopyTest: {
    variants: ['control', 'subtitle', 'contributeBox'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independence: 3,
  },

  ukRecurringAmountsTest: {
    variants: ['control', 'higher', 'lower', 'wildcard'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independence: 4,
  },

  usRecurringAmountsTest: {
    variants: ['control', 'higher', 'lower', 'wildcard'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independence: 5,
  },
};
