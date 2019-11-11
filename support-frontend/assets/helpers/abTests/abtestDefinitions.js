// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type LandingPageStripeElementsRecurringTestVariants = 'control' | 'stripeElements' | 'notintest';
export type PaymentSecurityR2CreditCardTestVariants = 'control' | 'showCards';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';

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

  stripeElementsRecurring: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'stripeElements',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: !!window.guardian && !!window.guardian.stripeElementsRecurring,
    independent: true,
    seed: 3,
    targetPage: contributionsLandingPageMatch,
  },

  paymentSecurityR2CreditCardTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'showCards',
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
  },
};
