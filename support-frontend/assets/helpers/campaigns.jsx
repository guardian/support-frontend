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
  contributeCopy?: React$Element<string>,
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

const currentCampaignName = null;

export const campaigns: Campaigns = {};

export type CampaignName = $Keys<typeof campaigns>

export function getCampaignName(): ?CampaignName {
  if (currentCampaignName) {
    return window.guardian.forceCampaign || window.location.pathname.endsWith(`/${currentCampaignName}`) ?
      currentCampaignName :
      undefined;
  }
  return undefined;
}
