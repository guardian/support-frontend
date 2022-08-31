import { viewports } from './viewports';
import { withFocusStyleManager } from './decorators/withFocusStyleManager';
import { withSourceReset } from './decorators/withSourceReset';
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
	layout: 'fullscreen',
};

export const decorators = [withFocusStyleManager, withSourceReset];

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
