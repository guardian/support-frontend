import { defineConfig } from '@playwright/test';
import { getCdpEndpoint } from './browserstack.config';

export default defineConfig({
	testDir: './tests',
	testMatch: '**/*.ts',

	globalSetup: require.resolve('./global-setup.ts'),
	globalTeardown: require.resolve('./global-teardown.ts'),

	/* Maximum time one test can run for. */
	timeout: 90 * 1000,
	expect: {
		timeout: 5000,
	},
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

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
