// @flow

// ----- Imports ----- //

import React from 'react';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-thank-you-page');
