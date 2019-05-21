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
};

export type Campaigns = {
  [string]: CampaignSettings,
};

const currentCampaignName = 'toxicamerica';

export const campaigns: Campaigns = {
  toxicamerica: {
    formMessage: (
      <div>
        <div className="form-message__headline">Make a contribution</div>
        <div className="form-message__body">to our dedicated series ‘Toxic America’</div>
      </div>
    ),
    headerCopy: (
      <span>Toxic America: Help us fight for <br className="responsive-break" />a cleaner world</span>
    ),
    contributeCopy: (
      <div>
        <p>
          We’re asking our readers to support a six-month Guardian series about the growing scale
          and deepening health implications of living in an environment that exposes us to chemical
          contamination on a daily basis through the air we breathe, the food we eat, the products
          we use and the water we drink. The project will:
        </p>
        <ul>
          <li className="blurb-list-item">
            Hold politicians, the Trump administration, the EPA and the FDA
            accountable for regulatory rollbacks and failures keep dangerous
            chemicals out of products and off of store shelves
          </li>
          <li className="blurb-list-item">
            Offer advice on how to navigate the supermarket and make food
            choices to reduce your exposure
          </li>
          <li className="blurb-list-item">
            Look at everyday dangers in our homes, from flame retardants in the sofa to
            carcinogens in dry cleaning
          </li>
          <li className="blurb-list-item">
            Explore how plastic pollution is impacting human health
          </li>
          <li className="blurb-list-item">
            Report on threats to our drinking water supply
          </li>
          <li className="blurb-list-item">
            Deliver rigorous, accessible, scientific reporting that explains what we
            know about how the chemicals in our environment are impacting our health
            and raises public awareness about this issue
          </li>
        </ul>
        <p>
          Reader support protects The Guardian’s independence and ensures our in-depth
          environmental journalism remains open to all. Our editorial independence allows us
          to fight for transparency and accountability – and deliver the facts with
          clarity. <span className="bold">Please help us reach our goal by contributing today.</span>
        </p>
      </div>
    ),
    termsAndConditions: (contributionsTermsLink: string) => (
      <div className="component-terms-privacy component-terms-privacy--campaign-landing">
        <p>
          By proceeding, you’re agreeing to our <span className="bold">Terms and Conditions</span>.
          If we hit our goal of $150,000, The Guardian will allocate this amount to its core
          operations which will help fund the completion of Toxic America series, including
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
          We’re also seeking larger contributions to support The Guardian’s reporting from companies,
          foundations and individuals. If you would like to get involved with this project or provide
          matching funds, please <a href="mailto:apac.help@theguardian.com">contact us</a>.
        </p>
      </div>
    ),
    goalReachedCopy: null,
    tickerJsonUrl: '/ticker.json',
    tickerType: 'hardstop',
    cssModifiers: ['campaign-landing', currentCampaignName],
    contributionTypes: generateContributionTypes([
      { contributionType: 'ONE_OFF', isDefault: true },
    ]),
    backgroundImage: 'https://media.guim.co.uk/de76ba8d8823325d02ff93376cfe0c39962b215d/0_0_2000_577/2000.jpg',
  },
};

export type CampaignName = $Keys<typeof campaigns>

export function getCampaignName(): ?CampaignName {
  return window.location.pathname.endsWith(`/${currentCampaignName}`) ? currentCampaignName : undefined;
}
