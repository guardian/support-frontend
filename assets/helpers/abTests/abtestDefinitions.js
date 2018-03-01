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
    isActive: true,
    independent: true,
    seed: 0,
  },
};
