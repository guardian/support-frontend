// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';
import { SetOne, SetTwo } from 'helpers/abTests/data/testAmountsData';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type LandingPageChoiceArchitectureAmountsFirstTestVariants = 'control'
  | 'amountsFirstSetOne'
  | 'amountsFirstSetTwo'
  | 'productFirstSetOne'
  | 'productFirstSetTwo'
  | 'notintest';
export type StripeElementsTestVariants = 'control' | 'stripeCardElement' | 'notintest';

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

  // JTL - 5 August 2019 - Ab-test: landingPageChoiceArchitectureAmountsFirst
  // file used for this test: abTestContributionsLandingChoiceArchitecture.scss
  // if a variant is successful, we will need to integrate the styles from the test stylesheet
  // into the main stylesheet: contributionsLanding.scss
  // This test also involves hardcoded amounts, which will need to be discussed moving forward
  landingPageChoiceArchitectureAmountsFirst: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'amountsFirstSetOne',
        amountsRegions: SetOne,
      },
      {
        id: 'amountsFirstSetTwo',
        amountsRegions: SetTwo,
      },
      {
        id: 'productFirstSetOne',
        amountsRegions: SetOne,
      },
      {
        id: 'productFirstSetTwo',
        amountsRegions: SetTwo,
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
    seed: 4,
  },

  stripeElements: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'stripeCardElement',
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
    seed: 3,
  },
};
