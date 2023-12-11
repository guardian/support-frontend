import { renderToString } from 'react-dom/server';
import { supporterPlusLanding } from 'pages/supporter-plus-landing/preRenderSupporterPlus';

export const pages = [
	{
		filename: 'supporter-plus-landing.html',
		html: renderToString(supporterPlusLanding()),
	},
	{
		filename: 'supporter-plus-landing-US.html',
		html: renderToString(supporterPlusLanding('US')),
	},
	{
		filename: 'digital-subscription-checkout-page.html',
		html: renderToString(supporterPlusLanding('UK', true)),
	},
];
