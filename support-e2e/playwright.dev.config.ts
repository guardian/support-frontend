import { config as baseConfig } from './playwright.config';

const config = {
	...baseConfig,
	use: {
		baseURL: 'https://support.thegulocal.com',
	},
};

export default config;
