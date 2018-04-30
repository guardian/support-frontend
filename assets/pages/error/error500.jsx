// @flow

// ----- Imports ----- //

import React from 'react';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import ErrorContent from './components/errorContent';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <ErrorContent
    errorCode="500"
    headings={['sorry - we seem', 'to be having a', 'problem completing', 'your request']}
    copy="Please try again. If the problem persists, please report it."
  />
);

renderPage(content, 'error-500-page');
