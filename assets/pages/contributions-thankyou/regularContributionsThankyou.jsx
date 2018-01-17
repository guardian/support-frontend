// @flow

// ----- Imports ----- //

import React from 'react';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from './components/thankYouIntroduction';
import QuestionsAndSocial from './components/questionsAndSocial';

// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <section className="thankyou gu-content-filler">
      <div className="thankyou__content gu-content-filler__inner">
        <ThankYouIntroduction thankYouMessage="You have helped to make the Guardian&#39;s future more secure.
            Look out for an email confirming your recurring
            payment."
        />
        <QuestionsAndSocial />
      </div>
    </section>
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-thankyou-page');
