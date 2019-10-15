// @flow
import type { Tests } from './abtest';
import { get as getCookie } from 'helpers/cookie';
import { getCampaignName } from 'helpers/campaigns';
import { V1, V2 } from 'helpers/abTests/data/testAmountsData';

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

  landingPageAmountsRound4: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: V1,
      },
      {
        id: 'V2',
        amountsRegions: V2,
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

  nativeVariantAllocationTest: {
    type: 'OTHER',
    variants: [
      {
        id: '0',
      },
      {
        id: '1',
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
    targetPage: '/(uk|us|au|ca|nz)/subscribe$',
  },
};
