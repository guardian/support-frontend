// @flow

// ----- Imports ----- //

import React from 'react';
import { getQueryParameter } from 'helpers/url';
import { renderPage } from 'helpers/render';
import CtaLink from 'components/ctaLink/ctaLink';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from './components/thankYouIntroduction';
import QuestionsAndSocial from './components/questionsAndSocial';
import { statelessInit as pageInit } from '../../helpers/page/page';


// ----- Page Startup ----- //
pageInit();

// ----- Render ----- //

const copy = getQueryParameter('optIn') === 'yes'
  ? 'We\'ll be in touch. Check your inbox for a confirmation link.'
  : 'Your preference has been recorded.';

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="thankyou gu-content-filler">
      <div className="thankyou__content gu-content-filler__inner">
        <ThankYouIntroduction thankYouMessage={copy} />
        <div className="thankyou__wrapper">
          <CtaLink
            ctaId="return-to-the-guardian"
            text="Return to the Guardian"
            url="https://theguardian.com"
            accessibilityHint="Go to the guardian dot com front page"
          />
        </div>
        <QuestionsAndSocial />
      </div>
    </section>
    <Footer />
  </div>
);


renderPage(content, 'contributions-confirm-marketing');
