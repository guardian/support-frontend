import { renderToString } from 'react-dom/server';
import { EmptyContributionsLandingPage } from 'pages/contributions-landing/EmptyContributionsLandingPage';
import { content as showcase } from 'pages/showcase/showcase';

const render = (content) => renderToString(content);

export const pages = [
	{
		filename: 'showcase.html',
		html: render(showcase),
	},
	{
		filename: 'contributions-landing.html',
		html: render(EmptyContributionsLandingPage()),
	},
];
