// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type ThankYouPageMarketingComponentTestVariants = 'control' | 'newMarketingComponent' | 'notintest';

export const tests: Tests = {
  landingPageCopyReturningSingles: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'returningSingle',
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
    canRun: () => !!getCookie('gu.contributions.contrib-timestamp'),
  },

  thankYouPageMarketingComponent: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'newMarketingComponent',
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
    seed: 2,
  },
};
