// @flow

import type { ContributionTypes } from 'helpers/contributions';

export type TickerType = 'unlimited' | 'hardstop';

export type TickerSettings = {
  goalReachedCopy: React$Element<string> | null,
  tickerJsonUrl: string,
  tickerType: TickerType,
  localCurrencySymbol: string
}

export type CampaignSettings = {
  headerCopy?: string | React$Element<string>,
  contributeCopy?: string | React$Element<string>,
  formMessage?: React$Element<string>,
  termsAndConditions?: (contributionsTermsLink: string, contactEmail: string) => React$Element<string>,
  cssModifiers?: string[],
  contributionTypes?: ContributionTypes,
  backgroundImage?: string,
  extraComponent?: React$Element<string>,
  tickerSettings?: TickerSettings,
};

export type Campaigns = {
  [string]: CampaignSettings,
};

const currentCampaignName = 'eu/contribute';

export const campaigns: Campaigns = {
  [currentCampaignName]: {
    headerCopy: 'Support our journalism in Europe and beyond',
    contributeCopy: 'Your support helps protect the Guardian’s independence. These are testing times, and crises and their solutions are not limited by national boundaries. But then, neither are we. Every contribution, however big or small, is so valuable.',
  },
};

export type CampaignName = $Keys<typeof campaigns>

export function getCampaignName(): ?CampaignName {
  if (currentCampaignName) {
    return window.guardian.forceCampaign || window.location.pathname.endsWith(`/${currentCampaignName}`) ?
      currentCampaignName :
      undefined;
  }
  return undefined;
}
