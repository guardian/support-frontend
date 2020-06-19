// @flow

import type { ContributionTypes } from 'helpers/contributions';
import type { TickerSettings } from 'components/ticker/contributionTicker';
import ausMomentEnabled from 'helpers/ausMoment';

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

const currentCampaignName = ausMomentEnabled('AU') ? 'au/contribute' : null;

export const campaigns: Campaigns = currentCampaignName ? {
  // TODO - the rest of the campaign settings
  [currentCampaignName]: {
    campaignCode: 'Aus_moment_2020',
    headerCopy: 'You’re doing something powerful',
    contributeCopy: 'Help us grow our community of supporters in Australia and reach our ambitious goal. Every contribution you make, however big or small, helps sustain our open, independent journalism for the long term.',
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
