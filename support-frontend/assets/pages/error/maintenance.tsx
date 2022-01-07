// ----- Imports ----- //
import React from 'react';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import ErrorPage from './components/errorPage';

// ----- Page Startup ----- //
setUpTrackingAndConsents();

// ----- Render ----- //
const content = (
	<ErrorPage
		headings={[
			"Sorry, we've had to take our website down for essential maintenance",
		]}
		copy="We're working hard to get things back online soon, so please come back later and try again"
		supportLink={false}
	/>
);
renderPage(content, 'down-for-maintenance-page');
