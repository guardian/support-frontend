// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  oneOffOneTimeSingle: {
    variants: ['control', 'single', 'once', 'oneTime'],
    audiences: {
      GBPCountries: {
        offset: 0,
        size: 1,
      },
      AUDCountries: {
        offset: 0,
        size: 1,
      },
      Canada: {
        offset: 0,
        size: 1,
      },
      NZDCountries: {
        offset: 0,
        size: 1,
      },
      International: {
        offset: 0,
        size: 1,
      },
      EURCountries: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 0,
  },
  inlineStripeFlowCardPayment: {
    variants: ['control', 'inline'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independent: true,
    seed: 1,
  },
  usOneOffOneTimeSingle: {
    variants: ['control', 'single', 'once', 'oneOff'],
    audiences: {
      UnitedStates: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 2,
  },
  annualContributions: {
    variants: ['control', 'annual'],
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
  recurringGuestCheckout: {
    variants: ['control', 'guest'],
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
