// @flow
import type { Tests } from './abtest';

export type LandingPageCopyAllContributionsTestVariants = 'control' | 'allContributions' | 'notintest';
// ----- Tests ----- //

export const tests: Tests = {
  landingPageCopyAllContributions: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'allContributions',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 1,
  },
};

