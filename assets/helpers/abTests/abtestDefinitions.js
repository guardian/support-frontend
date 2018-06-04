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
};
