// @flow

// ----- Imports ----- //

import React from 'react';

import { renderPage } from 'helpers/render';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';


// ----- Render ----- //

const content = (
  <div>
    <SimpleHeader />
    <Footer />
  </div>
);

renderPage(content, 'digital-subscription-landing-page');
