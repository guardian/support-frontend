// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  ssr: {
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

  requiredFields: {
    variants: ['control', 'variant'],
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

};
