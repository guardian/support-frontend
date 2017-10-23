// @flow

// ----- Imports ----- //

import React from 'react';
import ReactDOM from 'react-dom';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import CtaLink from 'components/ctaLink/ctaLink';
import InfoSection from 'components/infoSection/infoSection';
import SocialShare from 'components/socialShare/socialShare';

import { statelessInit as pageInit } from 'helpers/page/page';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="thankyou gu-content-filler">
      <div className="thankyou__content gu-content-filler__inner">
        <div className="thankyou__wrapper">
          <h1 className="thankyou__heading">Thank you!</h1>
          <h2 className="thankyou__subheading" id="qa-thank-you-message">
            <p>
              You&#39;ve made a vital contribution that will help us maintain
              our independent, investigative journalism
            </p>
          </h2>
          <CtaLink
            ctaId="return-to-the-guardian"
            text="Return to the Guardian"
            url="https://theguardian.com"
            accessibilityHint="Go to theguardian dot com front page"
          />
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

const element: ?Element = document.getElementById('oneoff-contributions-thankyou-page');

if (element) {
  ReactDOM.render(content, element);
}
