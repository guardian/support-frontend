// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
export type LandingPageChoiceArchitectureLabelsTestVariants = 'control' | 'withLabels' | 'notintest';

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

  // JTL - 5 August 2019 - Ab-test: landingPageChoiceArchitectureLabels
  // file created for this test: abTestContributionsLandingChoiceArchitecture.scss
  // if variant is successful, we will need to integrate the styles from the test stylesheet
  // into the main stylesheet: contributionsLanding.scss
  landingPageChoiceArchitectureLabels1b: {
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
};
