// @flow

import type { ContributionTypes } from 'helpers/contributions';
import type { TickerSettings } from 'components/ticker/contributionTicker';

export type CampaignSettings = {
  campaignCode: string,
  headerCopy?: string | React$Element<string>,
  contributeCopy?: string | React$Element<string>,
  formMessage?: React$Element<string>,
  termsAndConditions?: (contributionsTermsLink: string, contactEmail: string) => React$Element<string>,
  cssModifiers?: string[],
  contributionTypes?: ContributionTypes,
  backgroundImage?: string,
  extraComponent?: React$Element<string>,
  tickerSettings?: TickerSettings,
  goalReachedCopy?: React$Element<string>, // If set, the form will be replaced with this if goal reached
};

export type Campaigns = {
  [string]: CampaignSettings,
};

const currentCampaignName = window && window.guardian && window.guardian.ausMomentEnabled ? 'au/contribute' : null;

export const campaigns: Campaigns = currentCampaignName ? {
  // TODO - the rest of the campaign settings
  [currentCampaignName]: {
    campaignCode: 'Aus_moment_2020',
    tickerSettings: {
      tickerCountType: 'people',
      tickerEndType: 'unlimited',
      currencySymbol: '£',
      copy: {
        countLabel: 'supporters in Australia',
        goalReachedPrimary: 'We\'ve hit our goal!',
        goalReachedSecondary: 'but you can still support us',
      },
    },
  },
} : {};

export type CampaignName = $Keys<typeof campaigns>

export function getCampaignName(): ?CampaignName {
  if (currentCampaignName) {
    return window.guardian.forceCampaign || window.location.pathname.endsWith(`/${currentCampaignName}`) ?
      currentCampaignName :
      undefined;
  }
  return undefined;
}

export function getCampaignCode(): ?string {
  const name = getCampaignName();
  if (name) {
    return campaigns[name].campaignCode;
  }
  return undefined;
}
