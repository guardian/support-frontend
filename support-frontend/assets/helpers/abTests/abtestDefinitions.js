// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';
import { getCampaignName } from 'helpers/campaigns';

// ----- Tests ----- //
export type LandingPageCopyReturningSinglesTestVariants = 'control' | 'returningSingle' | 'notintest';
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

  digitalPackProductPageTest: {
    type: 'OTHER',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'newPage',
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
    seed: 9,
    targetPage: '/(uk|us|eu|au|ca|nz|int)/subscribe/digital$',
    optimizeId: 'emQ5nZJCS5mZkhtwwqfx5Q',
  },
};
