// @flow
import type { Tests } from './abtest';
import { USV1 } from './data/testAmountsData';
import ausMomentEnabled from 'helpers/ausMoment';

// ----- Tests ----- //
export type StripePaymentRequestButtonTestVariants = 'control' | 'button';
export type LandingPageDesignSystemTestVariants = 'ds';
export type AusMomentLandingPageBackgroundVariants = 'control' | 'ausColoursVariant';

const contributionsLandingPageMatch = '/(uk|us|eu|au|ca|nz|int)/contribute(/.*)?$';
const usOnlyLandingPage = '/us/contribute(/.*)?$';
const auOnlyLandingPage = '/au/contribute(/.*)?$';
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

  landingPageDesignSystemTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'ds',
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

  ausMomentLandingPageBackgroundTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'ausColoursVariant',
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: ausMomentEnabled('AU'),
    referrerControlled: false,
    seed: 6,
    targetPage: auOnlyLandingPage,
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
    targetPage: digitalCheckout,
    optimizeId: '',
  },
};
