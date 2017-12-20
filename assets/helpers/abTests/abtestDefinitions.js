// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  usRecurringAmountsTest: {
    variants: ['control', 'higher', 'range'],
    audiences: {
      US: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 1,
  },

};
