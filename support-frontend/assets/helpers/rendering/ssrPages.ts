import { renderToString } from 'react-dom/server';
import { EmptyContributionsLandingPage } from 'pages/contributions-landing/EmptyContributionsLandingPage';
import { content as showcase } from 'pages/showcase/showcase';

export const pages = [
	{
		filename: 'showcase.html',
		html: renderToString(showcase),
	},
	{
		filename: 'contributions-landing.html',
		html: renderToString(EmptyContributionsLandingPage()),
	},
];
