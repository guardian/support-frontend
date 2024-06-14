import { renderToString } from 'react-dom/server';
import { digitalSubscriptionLandingPage } from 'pages/digital-subscriber-checkout/preRenderDigitalSubscriptionLandingPage';
// import { supporterPlusLanding } from 'pages/supporter-plus-landing/preRenderSupporterPlusLandingPage';
import { threeTierLanding } from 'pages/supporter-plus-landing/preRenderThreeTierLanding';

export const pages = [
	{
		filename: 'supporter-plus-landing.html',
		// html: renderToString(supporterPlusLanding),
		html: renderToString(threeTierLanding),
	},
	{
		filename: 'digital-subscription-landing.html',
		html: renderToString(digitalSubscriptionLandingPage),
	},
];
