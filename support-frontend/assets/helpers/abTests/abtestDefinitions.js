// @flow
import type { Tests } from './abtest';
import {
  type CountryGroupId,
  detect,
} from 'helpers/internationalisation/countryGroup';

// ----- Tests ----- //
export type RecurringStripePaymentRequestButtonTestVariants = 'control' | 'paymentRequestButton' | 'notintest';
export type paymentSecuritySecureTransactionGreyNonUKVariants = 'control' | 'V1_securetransactiongrey' | 'notintest';
export type LandingPageReverseAmountsTestVariant = 'control' | 'reversedAmounts' | 'notintest';
export type NewLandingPageTemplateTestVariants = 'control' | 'new_template';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usContributionsLandingPageMatch = '/us/contribute(/.*)?$';
const subsShowcasePageMatch = '/(eu|int)/subscribe(/.*)?$';

const countryGroupId: CountryGroupId = detect();

export const tests: Tests = {
  recurringStripePaymentRequestButton: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'paymentRequestButton',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: window.guardian && !!window.guardian.recurringStripePaymentRequestButton,
    independent: true,
    seed: 2,
    targetPage: contributionsLandingPageMatch,
  },

  paymentSecuritySecureTransactionGreyNonUK: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1_securetransactiongrey',
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
    seed: 10,
    targetPage: contributionsLandingPageMatch,
    canRun: () => countryGroupId !== 'GBPCountries',
  },

  landingPageReverseAmounts: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'reversedAmounts',
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
    seed: 3,
    targetPage: usContributionsLandingPageMatch,
    canRun: () => countryGroupId === 'UnitedStates',
  },

  subsShowcaseOrderingTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'weeklyTop',
      },
      {
        id: 'digitalTop',
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
    seed: 4,
    targetPage: subsShowcasePageMatch,
    optimizeId: 'sj4_I5OAT3SJpqgnxtJ6Xg',
  },

  newLandingPageTemplateTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'new_template',
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
    seed: 11,
    targetPage: contributionsLandingPageMatch,
    canRun: () => countryGroupId !== 'UnitedStates',
  },
  newLandingPageTemplateTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'new_template',
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
    seed: 11,
    targetPage: contributionsLandingPageMatch,
    canRun: () => countryGroupId === 'UnitedStates',
  },
};
