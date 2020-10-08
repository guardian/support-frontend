// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import CtaLink from 'components/ctaLink/ctaLink';
import PageSection from 'components/pageSection/pageSection';
import QuestionsContact from 'components/questionsContact/questionsContact';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect } from 'helpers/internationalisation/countryGroup';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <Page
    header={<Header countryGroupId={detect()} />}
    footer={<Footer />}
  >
    <div className="paypal-error">
      <PageSection
        modifierClass="paypal-error"
      >
        <h1 className="paypal-error__heading">PayPal Error!</h1>
        <p className="paypal-error__copy">
          Sorry, there was a problem completing your PayPal payment. Please try again:
        </p>
        <CtaLink
          text="Become a Supporter"
          url="/"
          accessibilityHint="Restart your journey to become a guardian supporter"
        />
      </PageSection>
      <QuestionsContact />
    </div>
  </Page>
);

renderPage(content, 'paypal-error-page');
