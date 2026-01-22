import { withFocusStyleManager } from './decorators/withFocusStyleManager';
import { withUKPath } from './decorators/withUKPath';
import { viewports } from './viewports';
import '../assets/stylesheets/gu-sass/gu-sass.scss';
import '../assets/stylesheets/skeleton/fonts.scss';
import '../assets/stylesheets/skeleton/reset-src.scss';
import '../assets/stylesheets/skeleton/html.scss';
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
		options: viewports,
	},
	layout: 'fullscreen',
	docs: {
		codePanel: true,
	},
};

const decorators = [withFocusStyleManager, withUKPath];

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

if (typeof window !== 'undefined') {
	window.guardian = window.guardian || {};
	window.guardian.settings = window.guardian.settings || {};
	window.guardian.settings.metricUrl = 'https://metrics.gutools.co.uk';

	const domain = window.location.hostname;
	const userName = 'storybook-user';
	const cookies = [
		{ name: 'pre-signin-test-user', value: userName, domain, path: '/' },
		{ name: '_test_username', value: userName, domain, path: '/' },
		{ name: '_post_deploy_user', value: 'true', domain, path: '/' },
		{ name: 'GU_TK', value: '1.1', domain, path: '/' },
	];

	cookies.forEach(({ name, value, path }) => {
		// Let the browser use the current host as domain (storybook host)
		document.cookie = `${name}=${encodeURIComponent(
			value,
		)}; path=${path}; SameSite=Lax`;
	});
}

/** This avoids having false positives when the date changes */
MockDate.set('Sat Jan 1 2024 12:00:00 GMT+0000 (Greenwich Mean Time)');

const tags = ['autodocs'];

const preview = { parameters, decorators, argTypes, tags };
export default preview;
