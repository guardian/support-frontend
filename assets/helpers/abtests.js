// @flow
import type { Test } from './abtest';

// ----- Tests ----- //

export type Tests = { [testId: string]: Test }

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
