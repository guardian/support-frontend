// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.

export const pageUrlRegexes = {
  contributions: {
    allLandingPagesAndThankyouPages: '/contribute|thankyou(/.*)?$',
    notUkLandingPage: '/us|au|eu|int|nz|ca/contribute(/.*)?$',
  },
  subscriptions: {
    subsShowcaseAndDigiSubPages: '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)',
    digiSubLandingPages: '(/??/subscribe/digital/gift(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)',
    digiSubLandingPagesNotAus: '(/(uk|us|ca|eu|nz|int)/subscribe/digital(\\?.*)?$)',
  },
};

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
    targetPage: pageUrlRegexes.contributions.notUkLandingPage,
    seed: 2,
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
    targetPage: pageUrlRegexes.subscriptions.digiSubLandingPagesNotAus,
    seed: 19,
    optimizeId: '8oNvN_m2QP6U7KeAHP_lsQ',
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
      SE: {
        offset: 0,
        size: 1,
      },
      CH: {
        offset: 0,
        size: 1,
      },
      NO: {
        offset: 0,
        size: 1,
      },
      DK: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
    seed: 0,
  },
};
