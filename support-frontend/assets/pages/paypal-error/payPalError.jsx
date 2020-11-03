// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import Header from 'components/headers/header/header';
import Footer from 'components/footer/footer';
import PageSection from 'components/pageSection/pageSection';
import QuestionsContact from 'components/questionsContact/questionsContact';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect } from 'helpers/internationalisation/countryGroup';
import { LinkButton } from '@guardian/src-button';

// ----- Page Startup ----- //

pageInit();

// ----- Render ----- //

const content = (
  <Page header={<Header countryGroupId={detect()} />} footer={<Footer />}>
    <div className="paypal-error">
      <PageSection modifierClass="paypal-error">
        <h1 className="paypal-error__heading">Something went wrong</h1>
        <p className="paypal-error__copy">
          Sorry, there was a problem completing your PayPal payment. Please try
          again:
        </p>
        <LinkButton href="/">Try again</LinkButton>
      </PageSection>
      <QuestionsContact />
    </div>
  </Page>
);

renderPage(content, 'paypal-error-page');
