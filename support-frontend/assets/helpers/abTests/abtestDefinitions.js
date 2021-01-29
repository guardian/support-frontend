// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

const landingPage = '/??/contribute|thankyou(/.*)?$';
const allLandingPagesAndThankyouPages = '/??/contribute|thankyou(/.*)?$';
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
    targetPage: landingPage,
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
};
