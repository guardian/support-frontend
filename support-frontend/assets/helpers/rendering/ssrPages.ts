import { renderToString } from 'react-dom/server';
import { content as showcase } from 'pages/showcase/showcase';

export const pages = [
	{
		filename: 'showcase.html',
		html: renderToString(showcase),
	},
];
