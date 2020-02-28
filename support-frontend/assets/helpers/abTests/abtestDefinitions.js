// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //
export type StripePaymentRequestButtonScaTestVariants = 'control' | 'sca' | 'notintest';

export type ChoiceCardsProductSetTestVariants = 'control' | 'circles' | 'rectangles';
export type PersonalisedThankYouPageTestVariants = 'control' | 'personalised' | 'notintest';
export type PostContributionReminderCopyTestVariants = 'control' | 'extendedCopy' | 'notintest';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const digitalLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/subscribe/digital(/.*)?$';

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

  SubsBannerNewYearCopyTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'variant',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 0,
      },
    },
    isActive: true,
    referrerControlled: true,
    seed: 12,
    targetPage: digitalLandingPageMatch,
    optimizeId: '21HyzxNZSmikdtgJQNnXUw',
  },

  choiceCardsProductSetTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'circles',
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
    isActive: false,
    referrerControlled: false,
    seed: 3,
    targetPage: contributionsLandingPageMatch,
  },
};
