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

  gbStructureTest: {
    variants: ['control', 'contributeOnTop'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independence: 8,
  },
};
