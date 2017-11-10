// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import CtaLink from 'components/ctaLink/ctaLink';
import InfoSection from 'components/infoSection/infoSection';
import SocialShare from 'components/socialShare/socialShare';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import TrackedComponent from 'components/trackedComponent/trackedComponent';
import { trackComponentEvents } from 'helpers/tracking/ophanComponentEventTracking';
import type { OphanComponent } from 'helpers/tracking/ophanComponentEventTypes';


// ----- Page Startup ----- //

pageInit();

const upSellCampaignCode = 'oneoff-thankyou-page-recurring-upsell';

const componentMetaData: OphanComponent = {
  componentType: 'ACQUISITIONS_THANK_YOU_EPIC',
  id: 'oneoff-thankyou-page-recurring-upsell',
  products: ['RECURRING_CONTRIBUTION'],
  upSellCampaignCode,
  labels: [],
};

const country = detectCountry();
const currency = detectCurrency(country);

// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="thankyou gu-content-filler">
      <div className="thankyou__content gu-content-filler__inner">
        <div className="thankyou__wrapper">
          <h1 className="thankyou__heading">Thank you</h1>
          <h2 className="thankyou__subheading" id="qa-thank-you-message">
            <p>
              You&#39;ve made a vital contribution that will help us maintain our independent,
                investigative journalism.
            </p>
          </h2>
          <TrackedComponent component={componentMetaData} >
            <h2 className="thankyou__cta-ask">
                    We need ongoing support from our readers, now more than ever &ndash; show
                      sustained support for the Guardian from as little as {currency.glyph}5 a month
            </h2>
            <CtaLink
              ctaId="return-to-the-guardian"
              text={`Contribute ${currency.glyph}5 a month`}
              url={`/contribute/recurring?contributionValue=5&contribType=MONTHLY&currency=${currency.iso}&INTCMP=${upSellCampaignCode}`}
              accessibilityHint={`Contribute from ${currency.glyph}5 a month`}
              onClick={() => { trackComponentEvents('CLICK', componentMetaData); }}
            />
          </TrackedComponent>

        </div>
        <InfoSection heading="Questions?" className="thankyou__questions">
          <p>
            If you have any questions about contributing to the Guardian,
            please <a href="mailto:contribution.support@theguardian.com">contact us</a>
          </p>
        </InfoSection>
        <InfoSection
          heading="Spread the word"
          className="thankyou__spread-the-word"
        >
          <p>
            We report for everyone. Let your friends and followers know that
            you support independent journalism.
          </p>
          <SocialShare name="facebook" />
          <SocialShare name="twitter" />
        </InfoSection>
      </div>
    </section>
    <SimpleFooter />
  </div>
);

renderPage(content, 'oneoff-contributions-thankyou-page');
