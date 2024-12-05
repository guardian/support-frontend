import { config as baseConfig } from './playwright.config';

const config = {
	...baseConfig,
	use: {
		baseURL: 'https://support.code.dev-theguardian.com',
	},
};

export default config;
