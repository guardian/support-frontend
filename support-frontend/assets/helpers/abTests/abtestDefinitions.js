// @flow
import type { Tests } from './abtest';
import { USV1, AusAmounts, UkAmountsV1, UkAmountsV2 } from './data/testAmountsData';
import { detect as detectCountryGroupId, GBPCountries } from 'helpers/internationalisation/countryGroup';

// ----- Tests ----- //
export type StripePaymentRequestButtonTestVariants = 'control' | 'button';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usOnlyLandingPage = '/us/contribute(/.*)?$';
const auOnlyLandingPage = '/au/contribute(/.*)?$';
const ukOnlyLandingPage = '/uk/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';
const digitalCheckout = '/subscribe/digital/checkout';

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

  fancyAddressTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'loqate',
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
    targetPage: digitalCheckout,
    optimizeId: '3sSS81FKT6SXawegvxyK-A',
  },

  removeDigiSubAddressTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'noAddress',
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
    seed: 7,
    canRun: () => detectCountryGroupId() === GBPCountries,
    targetPage: digitalCheckout,
    optimizeId: 'tdBE5yqdR0aQ19E06j1zRA',
  },

  auAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: AusAmounts,
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
    targetPage: auOnlyLandingPage,
    seed: 8,
  },

  ukAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: UkAmountsV1,
      },
      {
        id: 'V2',
        amountsRegions: UkAmountsV2,
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
    seed: 9,
  },
};
