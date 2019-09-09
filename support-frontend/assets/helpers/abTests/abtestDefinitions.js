// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type StripeElementsTestVariants = 'control' | 'stripeCardElement' | 'notintest';

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

  stripeElements: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'stripeCardElement',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: window.guardian && window.guardian.stripeElements ? window.guardian.stripeElements : false,
    independent: true,
    seed: 3,
  },
};
