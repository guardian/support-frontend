// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

const usLandingPage = '/us/contribute(/.*)?$';
const allLandingPagesAndThankyouPages = '/contribute|thankyou(/.*)?$';
const notUkLandingPage = '/us|au|eu|int|nz|ca/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';

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

  usLandingPageZipCodeFieldTest: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'zip-optional',
      },
      {
        id: 'zip-required',
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
    targetPage: usLandingPage,
    seed: 13,
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
};
