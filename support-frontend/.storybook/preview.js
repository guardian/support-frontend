import { viewports } from './viewports';
import '../assets/stylesheets/skeleton/skeleton.scss';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	viewport: {
		viewports,
	},
};

export const argTypes = {
	cssOverrides: {
		table: {
			disable: true,
		},
	},
	children: {
		table: {
			disable: true,
		},
	},
};
