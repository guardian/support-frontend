// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';
import { amountsFirstSetOne, amountsFirstSetTwo } from 'helpers/abTests/data/testAmountsData';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type ThankYouPageMarketingComponentTestVariants = 'control' | 'newMarketingComponent' | 'notintest';
export type LandingPageChoiceArchitectureLabelsTestVariants = 'control' | 'withLabels' | 'notintest';
export type LandingPageChoiceArchitectureAmountsFirstTestVariants = 'control' | 'amountsFirstSetOne' | 'amountsFirstSetTwo' | 'notintest';

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

  // JTL - 31 July 2019 - Ab-test: thankYouPageMarketingComponent
  // files related to this test:
  // - 'MarketingConsentContainer.jsx' became 'MarketingConsentControlContainer.jsx' and
  //    'MarketingConsentVariantContainer.jsx'
  // - 'MarketingConsentControlContainer.jsx renders the MarketingComponent (which
  //    should not be deleted regardless of this test's results because subscriptions
  //    uses it)
  // - 'MarketingConsentVariantContainer.jsx renders the MarketingComponent (which should become
  //    our default if it succeeds)
  // - 'ContributionsThankYouContainer', 'ContributionsThankYou', and
  //    'ContributionsThankYouPasswordSet' all incorporate the variants to control which
  //    marketing component is rendered on the thank you pages

  thankYouPageMarketingComponent: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'newMarketingComponent',
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
    seed: 2,
  },

  // JTL - 5 August 2019 - Ab-test: landingPageChoiceArchitectureLabels
  // file created for this test: abTestContributionsLandingChoiceArchitecture.scss
  // if variant is successful, we will need to integrate the styles from the test stylesheet
  // into the main stylesheet: contributionsLanding.scss
  landingPageChoiceArchitectureLabels: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'withLabels',
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
        amountsRegions: amountsFirstSetOne,
      },
      {
        id: 'amountsFirstSetTwo',
        amountsRegions: amountsFirstSetTwo,
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
};
