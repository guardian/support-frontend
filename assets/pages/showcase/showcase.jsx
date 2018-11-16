// @flow

// ----- Imports ----- //
import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import './showcase.scss';

// ----- Page Startup ----- //

pageInit();

// ----- Render ----- //

const content = (
  <Page
    header={<SimpleHeader />}
    footer={<Footer />}
  >
    coming soon
  </Page>
);

renderPage(content, 'showcase-landing-page');
