// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  directDebitTest: {
    variants: ['control', 'directDebit'],
    audiences: {
      GB: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independent: true,
    seed: 0,
  },
};
