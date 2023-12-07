import { renderToString } from 'react-dom/server';
import { digitalSubscriptionLanding } from 'pages/digital-subscriber-checkout/preRenderDigitalSubscriptionLandingPage';
import { supporterPlusLanding } from 'pages/supporter-plus-landing/preRenderSupporterPlusLandingPage';

export const pages = [
	{
		filename: 'supporter-plus-landing.html',
		html: renderToString(supporterPlusLanding),
	},
	{
		filename: 'digital-subscription-checkout-page.html',
		html: renderToString(digitalSubscriptionLanding),
	},
];
