// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type ThankYouPageMarketingComponentTestVariants = 'control' | 'newMarketingComponent' | 'notintest';

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
};
