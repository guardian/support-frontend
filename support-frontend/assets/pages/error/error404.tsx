// ----- Imports ----- //
import React from "react";
import { setUpTrackingAndConsents } from "helpers/page/page";
import { renderPage } from "helpers/rendering/render";
import ErrorPage from "./components/errorPage";
// ----- Page Startup ----- //
setUpTrackingAndConsents();
// ----- Render ----- //
const content = <ErrorPage errorCode="404" headings={['the page you', 'have requested', 'does not exist']} copy="You may have followed an outdated link, or have mistyped a URL. If you believe this to be an error, " reportLink />;
renderPage(content, 'error-404-page');