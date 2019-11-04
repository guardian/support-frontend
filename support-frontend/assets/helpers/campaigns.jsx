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
  termsAndConditions?: (contributionsTermsLink: string, contactEmail: string, isUK: boolean) => React$Element<string>,
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

const campaignEditorialLink = null;

export const campaigns: Campaigns = {
  [currentCampaignName]: {
    formMessage: (<div />
    ),
    headerCopy: (
      <span>
        We will not<br />
        stay quiet <br />
        <span className="moment-title-blue">
          on the <br className="responsive-break" />
          climate crisis
        </span>
      </span>
    ),
    contributeCopy: (
      <div>
        <p>
          <span className="bold">The climate emergency is the defining issue of our times.</span> This is
          The Guardian’s pledge: we will be truthful, resolute and undeterred in pursuing our journalism
          on the environment. Support from our readers makes this work possible. <a className="underline" href={campaignEditorialLink}>Read our pledge in full</a>.
        </p>
      </div>
    ),
    termsAndConditions: (contributionsTermsLink: string, contactEmail: string, isUK: boolean) => (
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
        {isUK ? (
          <span className="component-terms-privacy__divider">
            <p>
              If you would like to make a larger contribution, we have a Patron programme with three levels of
              support, which brings you closer to our work. For more information, please visit
              our <a className="underline" href="https://patrons.theguardian.com?INTCMP=climate_pledge_2019-patrons-link">Patrons site</a>.
            </p>
          </span>
        ) : (
          <span className="component-terms-privacy__divider">
            <p>
              We also accept larger contributions to support The Guardian’s reporting from companies, foundations and
              individuals. Please  <a href={`mailto:${contactEmail || ''}`}>contact us</a>.
            </p>
          </span>
        )}
      </div>
    ),
    cssModifiers: ['climate-moment'],
    extraComponent: (
      <div className="climate-moment_image-container">
        <img
          className="climate-moment_image"
          src="https://media.guim.co.uk/8fe60bf9d30df8481fcbccb91816a3c995279007/0_0_577_840/577.png"
          alt="Support the Guardian's pledge on climate change"
        />
      </div>
    ),
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
