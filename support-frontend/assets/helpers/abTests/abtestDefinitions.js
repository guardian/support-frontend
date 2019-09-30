// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';
import { SetOne, SetTwo, SetThree } from 'helpers/abTests/data/testAmountsData';
import { getCampaignName } from 'helpers/campaigns';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type StripeElementsTestVariants = 'control' | 'stripeCardElement' | 'notintest';
export type LandingPageMomentBackgroundColourTestVariants = 'control' | 'yellow' | 'notintest';

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
    isActive: window.guardian && window.guardian.stripeElements ? window.guardian.stripeElements : false,
    independent: true,
    seed: 3,
  },

  // JTL - 5 August 2019 - Ab-test: landingPageChoiceArchitectureAmountsFirst
  // file used for this test: abTestContributionsLandingChoiceArchitecture.scss
  // if a variant is successful, we will need to integrate the styles from the test stylesheet
  // into the main stylesheet: contributionsLanding.scss
  // This test also involves hardcoded amounts, which will need to be discussed moving forward
  LandingPageChoiceArchitectureStaticAmounts: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'setOne',
        amountsRegions: SetOne,
      },
      {
        id: 'setTwo',
        amountsRegions: SetTwo,
      },
      {
        id: 'setThree',
        amountsRegions: SetThree,
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

  landingPageMomentBackgroundColour: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'yellow',
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
    seed: 7,
    canRun: () => !!getCampaignName(),
  },
};
