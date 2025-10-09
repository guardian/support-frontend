import { viewports } from './viewports';
import { withFocusStyleManager } from './decorators/withFocusStyleManager';
import '../assets/stylesheets/skeleton/skeleton.scss';
import MockDate from 'mockdate';

const parameters = {
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

const decorators = [withFocusStyleManager];

const argTypes = {
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

/** This avoids having false positives when the date changes */
MockDate.set('Sat Jan 1 2024 12:00:00 GMT+0000 (Greenwich Mean Time)');

const tags = ['autodocs'];

const preview = { parameters, decorators, argTypes, tags };
export default preview;
