// @flow
import type { Tests } from './abtest';
import {
  type CountryGroupId,
  detect,
} from 'helpers/internationalisation/countryGroup';

// ----- Tests ----- //
export type RecurringStripePaymentRequestButtonTestVariants = 'control' | 'paymentRequestButton' | 'notintest';
export type PaymentSecuritySecureTransactionGreyNonUKVariants = 'control' | 'V1_securetransactiongrey' | 'notintest';
export type NewLandingPageTemplateTestVariants = 'control' | 'new_template' | 'notintest';
export type AmazonPaySingleUSTestVariants = 'control' | 'amazonPay' | 'notintest';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usContributionsLandingPageMatch = '/us/contribute(/.*)?$';

const countryGroupId: CountryGroupId = detect();

export const tests: Tests = {
  amazonPaySingleUS: {
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
    isActive: false,
    independent: true,
    seed: 1,
    targetPage: usContributionsLandingPageMatch,
  },

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

  newLandingPageTemplateTestR2: {
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
  },
};
