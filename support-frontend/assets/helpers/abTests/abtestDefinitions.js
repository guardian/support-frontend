// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //
export type StripePaymentRequestButtonScaTestVariants = 'control' | 'sca' | 'notintest';

export type ChoiceCardsProductSetTestR2Variants = 'control' | 'rectangles';
export type PersonalisedThankYouPageTestVariants = 'control' | 'personalised' | 'notintest';
export type PostContributionReminderCopyTestVariants = 'control' | 'extendedCopy' | 'notintest';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';

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
    targetPage: contributionsLandingPageMatch,
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

  choiceCardsProductSetTestR2: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'rectangles',
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
