// @flow

import React from 'react';

export type TickerType = 'unlimited' | 'hardstop';

export type CampaignSettings = {
  headerCopy?: string,
  contributeCopy?: React$Element<string>,
  formMessage?: React$Element<string>,
  termsAndConditions?: (contributionsTermsLink: string) => React$Element<string>,

  tickerJsonUrl?: string,
  cssModifiers?: string[],
  cssModifiers?: string[],
  tickerType: TickerType,
};

export type Campaigns = {
  [string]: CampaignSettings,
};

export const campaigns: Campaigns = {
  thefrontline: {
    formMessage: (
      <div>
        <div className="form-message__headline">Make a contribution</div>
        <div className="form-message__body">to our dedicated series ‘The Frontline’</div>
      </div>
    ),
    headerCopy: 'The Frontline: Australia and the climate emergency',
    contributeCopy: (
      <div>
        <p>
          The north is flooded, the south parched by drought.
          The Murray Darling, our greatest river system, has dried to a trickle,
          crippling communities and turning up millions of dead fish.
          The ancient alpine forests of Tasmania have burned.
          The summer was the hottest on record.
          We are living the reality of climate change.
        </p>
        <p>
          That’s why we need your help to bring our reporting on the climate crisis to light.
          We asked our readers to fund a new Guardian series – The Frontline: Australia and the climate emergency.
          Your response has been immediate and overwhelming, and thanks to your encouragement we have increased
          the goal to $150,000.
        </p>
        <p>
          <span>
              With your support, we can cut through the rhetoric and focus the debate on the facts.
              That way everyone can learn about the devastating and immediate
              threats to our country and how best to find a solution.
          </span>
        </p>
      </div>
    ),
    termsAndConditions: (contributionsTermsLink: string) => (
      <div className="component-terms-privacy">
        <p className="component-terms-thefrontline">
          By proceeding, you’re agreeing to our <span className="bold">Terms and Conditions</span>.
          If we hit our goal of $150,000, The Guardian will allocate this amount to its core operations
          which will help fund the completion of the ‘The Frontline: Australia and the climate emergency’ series,
          including editing, reporting, graphics and new commissions. If we fall short of the goal,
          The Guardian will allocate the funds for a scaled back project on climate change.
          Contributions will not be returned. Your contribution is also governed by
          our standard <a href={contributionsTermsLink}>contribution terms and conditions</a>.
        </p>
        <p>
          We also take larger gifts from companies, foundations and individuals to help support The Guardian’s
          independent, public interest journalism. If you would like to get involved, please <a href="mailto:apac.help@theguardian.com">contact us</a>.
        </p>
      </div>
    ),
    tickerJsonUrl: '/ticker.json',
    tickerType: 'hardstop',
    cssModifiers: ['frontline-campaign'],
  },
};

export type CampaignName = $Keys<typeof campaigns>

export function getCampaignName(): ?CampaignName {

  const currentCampaignName = 'toxicamerica';
  return window.location.pathname.endsWith(`/${currentCampaignName}`) ? currentCampaignName : undefined;
}


