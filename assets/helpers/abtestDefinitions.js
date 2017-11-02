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

  usMonthlyVsOneOff: {
    variants: ['one_off', 'monthly'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
  },
};
