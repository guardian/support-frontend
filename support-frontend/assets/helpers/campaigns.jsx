// @flow

import type { ContributionTypes } from 'helpers/contributions';
import type { TickerSettings } from 'components/ticker/contributionTicker';
import type {TickerCountType, TickerEndType} from "assets/components/ticker/contributionTicker";

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

const currentCampaignName = 'au/contribute';

export const campaigns: Campaigns = {
  //TODO - the rest of the campaign settings
  [currentCampaignName]: {
    tickerSettings: {
      tickerCountType: 'people',
      tickerEndType: 'unlimited',
      currencySymbol: '£',
      copy: {
        countLabel: 'supporters in Australia',
        goalReachedPrimary: 'You can still support us today',
        goalReachedSecondary: `thank you - we're over our goal`,
      },
    }
  }
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
