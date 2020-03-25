// @flow
import type { Tests } from './abtest';
import { V1 } from './data/testAmountsData';

// ----- Tests ----- //
export type StripePaymentRequestButtonScaTestVariants = 'control' | 'sca' | 'notintest';

export type ChoiceCardsProductSetTestR3Variants = 'control' | 'yellow';
export type PersonalisedThankYouPageTestVariants = 'control' | 'personalised' | 'notintest';
export type PostContributionReminderCopyTestVariants = 'control' | 'extendedCopy' | 'notintest';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const contributionsLandingPageWithoutAU = '/(uk|us|eu|ca|nz|int)/contribute(/.*)?$';
const usOnlyLandingPage = '/us/contribute(/.*)?$';

export const tests: Tests = {

  personalisedThankYouPageTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'personalised',
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
    seed: 1,
    targetPage: contributionsLandingPageWithoutAU,
  },

  recaptchaPresenceTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'recaptchaPresent',
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
    seed: 6,
    targetPage: contributionsLandingPageMatch,
  },

  usAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: V1,
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

  stripePaymentRequestButtonSca: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'sca',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: window.guardian && !!window.guardian.recurringStripePaymentRequestButton,
    referrerControlled: false,
    seed: 2,
    targetPage: contributionsLandingPageMatch,
  },

  choiceCardsProductSetTestR3: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'yellow',
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
    targetPage: contributionsLandingPageMatch,
  },
};
