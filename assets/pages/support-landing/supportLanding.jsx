// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { renderPage } from 'helpers/render';


// ----- Render ----- //

const content = (
  <div>
    <SimpleHeader />
    <Footer />
  </div>
);

renderPage(content, 'support-landing-page');
