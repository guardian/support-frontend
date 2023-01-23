import { renderToString } from 'react-dom/server';
import { supporterPlusLanding } from 'pages/supporter-plus-landing/preRenderSupporterPlusLandingPage';

export const pages = [
	{
		filename: 'supporter-plus-landing.html',
		html: renderToString(supporterPlusLanding),
	},
];
