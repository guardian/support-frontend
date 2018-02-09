// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ThankYouIntroduction from 'components/thankYouIntroduction/thankYouIntroduction';
import DotcomCta from 'components/dotcomCta/dotcomCta';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <ThankYouIntroduction
      highlights={['Thank you']}
      headings={['for a valuable', 'contribution']}
    />
    <DotcomCta />
    <QuestionsContact />
    <SpreadTheWord />
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-thank-you-page');
