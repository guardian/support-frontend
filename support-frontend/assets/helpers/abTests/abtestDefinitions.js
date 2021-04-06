// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

const allLandingPagesAndThankyouPages = '/contribute|thankyou(/.*)?$';
const allThankYouPages = '/thankyou(/.*)?$';
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

  landingPagePriceBreakdownTest: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'daily',
      },
      {
        id: 'none',
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
    seed: 14,
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

  thankyouPageMarketingConsentTest: {
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
    targetPage: allThankYouPages,
    seed: 17,
  },
  priceCardsInHeroTest: {
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
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    targetPage: digiSubLandingPages,
    seed: 3,
  },
};
