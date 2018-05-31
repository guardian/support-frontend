// @flow
import type { Tests } from './abtest';

// ----- Tests ----- //

export const tests: Tests = {
  ContributeLandingOneOffOnlyTest: {
    variants: ['control', 'oneOffOnly'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    customSegmentCondition: () => window.matchMedia('(max-width: 660px)').matches && (window.location.pathname.indexOf('contribute') > 0), // matches the 'phablet' breakpoint defined in breakpoints.scss
    isActive: true,
    independent: true,
    seed: 1,
  },
};
