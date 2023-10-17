import { defineConfig } from '@playwright/test';
import { getCdpEndpoint } from './browserstack.config';
import { baseObject } from './playwright.base.config';

export default defineConfig({
	...baseObject,

	globalSetup: require.resolve('./global-setup.ts'),
	globalTeardown: require.resolve('./global-teardown.ts'),

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chrome@latest:Windows 11',
			use: {
				connectOptions: {
					wsEndpoint: getCdpEndpoint(
						{
							browserName: 'chrome',
							browserVersion: 'latest',
							osName: 'Windows',
							osVersion: '11',
						},
						'testing the browserstack with new node',
					),
				},
			},
		},
	],
});
