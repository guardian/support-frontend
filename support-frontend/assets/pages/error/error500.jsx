// @flow

// ----- Imports ----- //

import React from 'react';

import { initPageWithoutRedux } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';

import ErrorPage from './components/errorPage';


// ----- Page Startup without Redux ----- //
initPageWithoutRedux();


// ----- Render ----- //

const content = (
  <ErrorPage
    errorCode="500"
    headings={['sorry - we seem', 'to be having a', 'problem completing', 'your request']}
    copy="Please try again. If the problem persists, "
    reportLink
  />
);

renderPage(content, 'error-500-page');
