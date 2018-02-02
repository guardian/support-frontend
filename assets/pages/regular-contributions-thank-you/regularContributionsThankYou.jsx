// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <CirclesIntroduction
      headings={['Thank you', 'for your valuable', 'contribution to', 'Guardian journalism']}
    />
    <SpreadTheWord />
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-thank-you-page');
