import { defineConfig } from '@playwright/test';
import { baseObject } from './playwright.base.config';

export default defineConfig({
	...baseObject,
	use: {
		baseURL: 'https://support.thegulocal.com', //To use CODE replace this with- https://support.code.dev-theguardian.com/
	},
});
