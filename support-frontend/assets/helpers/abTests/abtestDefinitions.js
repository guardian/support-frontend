// @flow
import type { Tests } from './abtest';
import { USV1, UKV1Lower, UKV2Higher } from './data/testAmountsData';

// ----- Tests ----- //
export type ChoiceCardsProductSetTestR3Variants = 'control' | 'yellow';
export type StripePaymentRequestButtonTestVariants = 'control' | 'button';
export type PersonalisedThankYouPageTestVariants = 'control' | 'personalised' | 'notintest';
export type PostContributionReminderCopyTestVariants = 'control' | 'extendedCopy' | 'notintest';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usOnlyLandingPage = '/us/contribute(/.*)?$';
const ukOnlyLandingPage = '/uk/contribute(/.*)?$';

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
  postContributionReminderCopyTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'extendedCopy',
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
    seed: 4,
    targetPage: contributionsLandingPageMatch,
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

  ukAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'lower',
        amountsRegions: UKV1Lower,
      },
      {
        id: 'higher',
        amountsRegions: UKV2Higher,
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
    targetPage: ukOnlyLandingPage,
    seed: 3,
  },

};
