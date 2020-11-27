// @flow
import type { Tests } from './abtest';
import { USV1, AusAmounts, UkAmountsV1 } from './data/testAmountsData';

// ----- Tests ----- //

const landingPage = '/??/contribute|thankyou(/.*)?$';
const usOnlyLandingPage = '/us/contribute(/.*)?$';
const usLandingPageAndThankyouPage = '/us/contribute|thankyou(/.*)?$';
const auOnlyLandingPage = '/au/contribute(/.*)?$';
const ukOnlyLandingPage = '/uk/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';

export const tests: Tests = {
  thankyouPageHeadingTest: {
    type: 'OTHER',
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

  usThankyouPageLargeDonationTest: {
    type: 'OTHER',
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
    targetPage: usLandingPageAndThankyouPage,
    seed: 11,
  },

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

  auAmountsTest2: {
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
    seed: 10,
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
