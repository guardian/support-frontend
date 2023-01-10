import { renderToString } from 'react-dom/server';
import { content as showcase } from 'pages/showcase/showcase';
import { supporterPlusLanding } from 'pages/supporter-plus-landing/preRenderSupporterPlusLandingPage';

export const pages = [
	{
		filename: 'showcase.html',
		html: renderToString(showcase),
	},
	{
		filename: 'supporter-plus-landing.html',
		html: supporterPlusLanding,
	},
];
