// @flow
import { getSession } from 'helpers/storage';
import type { Tests } from './abtest';

// ----- Tests ----- //

export type AnnualContributionsTestVariant = 'control' | 'annualAmountsA' | 'notintest';

export const tests: Tests = {
  annualContributionsRoundThree: {
    variants: ['control', 'annualAmountsA'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: false,
    independent: true,
    seed: 3,
  },

  smallMobileHeaderNotEpicOrBanner: {
    variants: ['control', 'shrink', 'shrink_no-blurb', 'shrink_no-blurb_no-header'],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    independent: true,
    seed: 4,
    canRun: () => ![
      'ACQUISITIONS_EPIC',
      'ACQUISITIONS_ENGAGEMENT_BANNER',
    ].some((componentType: string) => {
      // Try from session storage first. This is so that we get the correct header
      // on subsequent pageviews which don't have the componentType in the URL, e.g.
      // thank you page after PayPal one-off, or after changing country dropdown.
      const searchString = getSession('acquisitionData') || window.location.href;
      return searchString.includes(componentType);
    }),
  },
};
