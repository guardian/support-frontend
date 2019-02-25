// @flow

// ----- Imports ----- //

import React from 'react';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import ErrorPage from './components/errorPage';


// ----- Page Startup ----- //

pageInit();


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
