// @flow

import React from 'react';
import type { ContributionTypes } from 'helpers/contributions';

export type TickerType = 'unlimited' | 'hardstop';

export type CampaignSettings = {
  headerCopy?: string | React$Element<string>,
  contributeCopy?: React$Element<string>,
  formMessage?: React$Element<string>,
  termsAndConditions?: (contributionsTermsLink: string) => React$Element<string>,
  tickerJsonUrl?: string,
  cssModifiers?: string[],
  tickerType: TickerType,
  contributionTypes?: ContributionTypes,
  backgroundImage?: string,
  goalReachedCopy: React$Element<string> | null,
  localCurrencySymbol: string,
  extraComponent?: React$Element<string>,
};

export type Campaigns = {
  [string]: CampaignSettings,
};

const currentCampaignName = 'environmentpledge';

export const campaigns: Campaigns = {
  environmentpledge: {
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
          on the environment. Support from our readers makes this work possible. <a className="underline" href="https://theguardian.com">Read our pledge in full</a>.
        </p>
      </div>
    ),
    termsAndConditions: (contributionsTermsLink: string) => (
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
        <p>
          We’re also seeking larger contributions to support The Guardian’s reporting from companies,
          foundations and individuals. If you would like to get involved with this project or provide
          matching funds, please <a href="mailto:apac.help@theguardian.com">contact us</a>.
        </p>
      </div>
    ),
    goalReachedCopy: null,
    tickerType: 'unlimited',
    cssModifiers: ['environment-moment'],
    localCurrencySymbol: '£',
    extraComponent: (
      <div className="environment-moment_image-container">
        <img
          className="environment-moment_image"
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
    return window.location.pathname.endsWith(`/${currentCampaignName}`) ? currentCampaignName : undefined;
  }
  return undefined;
}
