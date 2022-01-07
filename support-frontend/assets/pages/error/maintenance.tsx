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
			"We're doing",
			'some essential',
			'maintenance on',
			'our website today',
		]}
		copy="We'll be back up and running very soon, so please come back later to complete your payment. Thank you for your support."
		supportLink={false}
	/>
);
renderPage(content, 'down-for-maintenance-page');
