// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //
export type AmazonPaySingleUSTestVariants = 'control' | 'amazonPay' | 'notintest';
export type StripePaymentRequestButtonScaTestVariants = 'control' | 'sca' | 'notintest';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usContributionsLandingPageMatch = '/us/contribute(/.*)?$';
const digitalLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/subscribe/digital(/.*)?$';

export const tests: Tests = {
  amazonPaySingleUS2020: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'amazonPay',
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
    seed: 13,
    targetPage: usContributionsLandingPageMatch,
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
};
