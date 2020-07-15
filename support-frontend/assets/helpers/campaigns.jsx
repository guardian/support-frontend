// @flow

import type { ContributionTypes } from 'helpers/contributions';
import type { TickerSettings } from 'components/ticker/contributionTicker';
import ausMomentEnabled from 'helpers/ausMoment';

type CampaignCopy = {
  headerCopy?: string | React$Element<string>,
  contributeCopy?: string | React$Element<string>,
};

export type CampaignSettings = {
  campaignCode: string,
  copy: (goalReached: boolean) => CampaignCopy,
  formMessage?: React$Element<string>,
  termsAndConditions?: (contributionsTermsLink: string, contactEmail: string) => React$Element<string>,
  cssModifiers?: string[],
  contributionTypes?: ContributionTypes,
  backgroundImage?: string,
  extraComponent?: React$Element<string>,
  tickerSettings?: TickerSettings,
  goalReachedCopy?: React$Element<string>, // If set, the form will be replaced with this if goal reached
};

const currentCampaignPath: string | null = ausMomentEnabled('AU') ? 'au/contribute' : null;

export const campaign: CampaignSettings = ({
  campaignCode: 'Aus_moment_2020',
  copy: (goalReached: boolean) => ({
    headerCopy: 'You’re doing something powerful',
    contributeCopy: goalReached ?
      'We’ve surpassed our ambitious goal of 150,000 supporters in Australia, and together we can do even more. Every contribution you make, however big or small, helps sustain our open, independent journalism for the long term.' :
      'Help us grow our community of supporters in Australia and reach our ambitious goal. Every contribution you make, however big or small, helps sustain our open, independent journalism for the long term.',
  }),
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
});

function campaignEnabledForUser(): boolean {
  if (currentCampaignPath) {
    return window.guardian.forceCampaign || window.location.pathname.endsWith(`/${currentCampaignPath}`);
  }
  return false;
}

export function getCampaignSettings(): CampaignSettings | null {
  if (campaignEnabledForUser()) {
    return campaign;
  }
  return null;
}

export function getCampaignCode(): ?string {
  const campaignSettings = getCampaignSettings();
  if (campaignSettings) {
    return campaignSettings.campaignCode;
  }
  return undefined;
}
