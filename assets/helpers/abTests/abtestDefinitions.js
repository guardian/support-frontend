// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  ssrTwo: {
    variants: ['off', 'on'],
    audiences: {
      ALL: {
        offset: 0,
        size: 0,
      },
    },
    isActive: true,
    independent: true,
    seed: 4,
  },

};
