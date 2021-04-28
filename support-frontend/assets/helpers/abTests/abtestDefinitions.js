// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.

const countryCode = (window.guardian && window.guardian.geoip && window.guardian.geoip.countryCode) || 'GB';
const allLandingPagesAndThankyouPages = '/contribute|thankyou(/.*)?$';
const notUkLandingPage = '/us|au|eu|int|nz|ca/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';

export const tests: Tests = {
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

  thankyouPageMarketingConsentTestR3: {
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
    seed: 18,
  },

  localCurrencyTest: {
    variants: [
      {
        id: 'control',
      },
      {
        id: 'variant',
      },
    ],
    audiences: {
      DE: {
        offset: 0,
        size: 1,
      },
    },
    canRun: () => ['SE', 'CH', 'NO', 'DK'].includes(countryCode),
    isActive: true,
    referrerControlled: false,
    targetPage: allLandingPagesAndThankyouPages,
    seed: 0,
  },
};
