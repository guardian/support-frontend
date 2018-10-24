// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export type AnnualContributionsTestVariant = 'control' | 'annualAmountsA';

// Participations in these tests are only assigned
// to browsers landing on pages/contributions-landing/contributionsLanding.jsx
export const oldContributionsFlowTests: Tests = {
  annualContributionsRoundThree: {
    variants: ['control', 'annualAmountsA'],
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
  newPaymentFlow: {
    // 100% of people will be put in this variant
    variants: ['control'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independent: true,
    seed: 4,
  },
};

// Participations in these tests are only assigned
// to browsers landing on pages/new-contributions-landing/contributionsLanding.jsx
export const newContributionsFlowTests: Tests = {
  annualContributionsRoundThree: {
    variants: ['control', 'annualAmountsA'],
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
  newPaymentFlow: {
    // 100% of people will be put in this variant
    variants: ['newPaymentFlow'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independent: true,
    seed: 5,
  },
};

export const tests: Tests = {
  // Participations in these tests will be assigned on all pages
  // EXCEPT the existing & new contributions landing pages
};
