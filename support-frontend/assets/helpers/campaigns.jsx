// @flow

import React from 'react';
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

const currentCampaignName = 'us/contribute';

export const campaigns: Campaigns = {
  [currentCampaignName]: {
    termsAndConditions: (contributionsTermsLink: string, contactEmail: string) => (
      <div className="component-terms-privacy component-terms-privacy--campaign-landing">
        <p>
          Monthly contributions are billed each month and annual contributions are billed
          once a year. You can change how much you give or cancel your contributions at any time.
        </p>
        <p>
          By proceeding, you are agreeing to our <a href={contributionsTermsLink}>Terms and Conditions</a>.
          To find out what personal data we collect and how we use it, please visit
          our <a href="https://www.theguardian.com/help/privacy-policy">Privacy Policy</a>.
        </p>
        <span className="component-terms-privacy__philo-ask">
          <p className="component-terms-privacy__philo-ask-header">
            Contribute another way
          </p>
          <p className="component-terms-privacy__philo-ask-body">
            Please <a href={`mailto:${contactEmail || ''}`}>contact us</a> if you would like to: make a
            larger contribution as an individual, contribute as a company or foundation, or would
            like to discuss legacy gifting. Thank you for your generous support.
          </p>
        </span>
      </div>
    ),
    cssModifiers: ['eoy2019'],
    extraComponent: (
      <div className="eoy2019_image" />
    ),
    tickerSettings: {
      goalReachedCopy: null,
      tickerJsonUrl: '/ticker.json',
      tickerType: 'hardstop',
      localCurrencySymbol: '$',
    },
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
