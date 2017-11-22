// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
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
    variants: ['control', 'lower', 'wildcard'],
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
    variants: ['control', 'lower', 'higher'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independence: 5,
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
    independence: 6,
  },

};
