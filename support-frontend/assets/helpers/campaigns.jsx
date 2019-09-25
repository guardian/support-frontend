// @flow

import React from 'react';
import type { ContributionTypes } from 'helpers/contributions';
import { generateContributionTypes } from 'helpers/contributions';

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
    formMessage: (
      <div>
        <div className="form-message__headline">Make a contribution</div>
      </div>
    ),
    headerCopy: (
      <span>We will not stay quiet <br className="responsive-break" />on the climate crisis</span>
    ),
    contributeCopy: (
      <div>
        <p>
        <span className="">The climate emergency is the defining issue of our times.</span> This is The Guardian’s pledge: we will be truthful, resolute and undeterred in pursuing our journalism on the environment. Support from our readers makes this work possible.
        </p>

      </div>
    ),
    termsAndConditions: (contributionsTermsLink: string) => (
      <div className="component-terms-privacy component-terms-privacy--campaign-landing">
        <p>
          By proceeding, you’re agreeing to our Terms and Conditions. If we hit our goal of
          $150,000, The Guardian will allocate this amount to its core operations which will
          help fund the completion of Toxic America series, including
          editing, reporting, graphics, and new commissions. If we exceed our goal, additional
          funds will be directed to The Guardian’s core operations and newsroom to support
          The Guardian’s independent journalism. Contributions will fund news, investigative
          reporting, commentary, and general operations. If we fall short of the goal, The Guardian
          will allocate the funds for a scaled-back project on the impact of toxins in America.
          Contributions will not be returned. Your contribution is also governed by our
          standard <a href={contributionsTermsLink}>contribution terms and conditions</a>.
        </p>
        <p>
          The ultimate owner of The Guardian is the Scott Trust Limited, whose role is to secure the
          editorial and financial independence of The Guardian in perpetuity. Reader contributions
          support The Guardian’s journalism.
        </p>
        <p>
          Please note that The Guardian is not a charity, will not use your support for charitable
          programs, and your support of The Guardian’s journalism does not constitute a charitable
          donation. As far as The Guardian is aware, your contribution is not eligible to be treated as
          a charitable deduction for tax purposes in the US or elsewhere. If you have any questions
          about contributing to The Guardian, please <a href="mailto:apac.help@theguardian.com">contact us</a>.
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
        <img className="environment-moment_image"
             src="https://media.guim.co.uk/8fe60bf9d30df8481fcbccb91816a3c995279007/0_0_577_840/577.png"
             alt="Support the Guardian's pledge on climate change"
        />
      </div>
    )
  },
};

export type CampaignName = $Keys<typeof campaigns>

export function getCampaignName(): ?CampaignName {
  if (currentCampaignName) {
    return window.location.pathname.endsWith(`/${currentCampaignName}`) ? currentCampaignName : undefined;
  }
  return undefined;
}
