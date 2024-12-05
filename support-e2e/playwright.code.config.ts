import { defineConfig } from '@playwright/test';
import { baseObject } from './playwright.base.config';

export default defineConfig({
	...baseObject,
	use: {
		...baseObject.use,
		baseURL: 'https://support.code.dev-theguardian.com',
	},
});
