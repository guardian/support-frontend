// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  dropIntroText: {
    variants: ['control', 'variant'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    customSegmentCondition: () => window.location.pathname.indexOf('contribute') > 0, // matches any contribute page
    isActive: true,
    independent: true,
    seed: 0,
  },
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
};
