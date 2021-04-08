// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.

const allLandingPagesAndThankyouPages = '/contribute|thankyou(/.*)?$';
const notUkLandingPage = '/us|au|eu|int|nz|ca/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';
const digiSubLandingPages = '(/??/subscribe/digital/gift(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';

export const tests: Tests = {
  thankyouPageHeadingTest: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
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
    targetPage: allLandingPagesAndThankyouPages,
    seed: 1,
  },

  stripePaymentRequestButtonDec2020: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'PRB',
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
    targetPage: notUkLandingPage,
    seed: 2,
  },

  globalThankyouPageLargeDonationTest: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
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
    targetPage: allLandingPagesAndThankyouPages,
    seed: 12,
  },

  accordionTest: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'accordionOpen',
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
    targetPage: digiSubLandingPages,
    seed: 16,
    optimizeId: 'oeDqGqpqT4OLrAaMJjYz6A',
  },

  thankyouPageMarketingConsentTestR2: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'v1',
      },
      {
        id: 'v2',
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
    targetPage: allLandingPagesAndThankyouPages,
    seed: 17,
  },
};
