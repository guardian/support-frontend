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
    errorCode="404"
    headings={['the page you', 'have requested', 'does not exist']}
    copy="You may have followed an outdated link, or have mistyped a URL. If you believe this to be an error, "
    reportLink
  />
);

renderPage(content, 'error-404-page');
