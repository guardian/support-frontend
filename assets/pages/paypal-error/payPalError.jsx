// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';
import InfoSection from 'components/infoSection/infoSection';
import SocialShare from 'components/socialShare/socialShare';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { contributionsEmail } from 'helpers/legal';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="paypal-error gu-content-filler">
      <div className="paypal-error__content gu-content-filler__inner">
        <div className="paypal-error__wrapper">
          <h1 className="paypal-error__heading">PayPal Error!</h1>
          <h2 className="paypal-error__subheading">
            <p>Sorry, there was a problem completing your PayPal payment. Please try again:</p>
          </h2>
          <CtaLink
            ctaId="become-supporter-paypal"
            text="Become a Supporter"
            url="https://support.theguardian.com/uk"
            accessibilityHint="Restart your journey to become a guardian supporter"
          />
        </div>
        <InfoSection heading="Questions?" className="paypal-error__questions">
          <p>
            If you have any questions about contributing to the Guardian,
            please <a href={contributionsEmail}>contact us</a>
          </p>
        </InfoSection>
        <InfoSection
          heading="Spread the word"
          className="paypal-error__spread-the-word"
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
    <Footer />
  </div>
);

renderPage(content, 'paypal-error-page');
