// @flow
import type { Tests } from './abtest';
import { USV1 } from './data/testAmountsData';

// ----- Tests ----- //
export type StripePaymentRequestButtonScaTestVariants = 'control' | 'sca' | 'notintest';

export type ChoiceCardsProductSetTestR3Variants = 'control' | 'yellow';
export type StripePaymentRequestButtonTestVariants = 'control' | 'button';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usOnlyLandingPage = '/us/contribute(/.*)?$';
const ukOnlyLandingPage = '/uk/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';

export const tests: Tests = {
  usAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: USV1,
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    targetPage: usOnlyLandingPage,
    seed: 5,
  },

  stripePaymentRequestButtonVsNoButton: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'button',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    seed: 2,
    targetPage: contributionsLandingPageMatch,
  },

  digitalPackMonthlyOfferTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'one-for-one',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    seed: 3,
    targetPage: subsShowcaseAndDigiSubPages,
    optimizeId: '0FxHy4ruSIOqVvgREPUwvw',
  },
};
