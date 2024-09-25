import { devices } from '@playwright/test';

export const config = {
	testDir: 'tests',
	testMatch: '**/*.test.ts',
	/* Maximum time one test can run for. */
	timeout: 120 * 1000,
	fullyParallel: true,
	/** Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	// maxFailures: process.env.CI ? 1 : undefined,
	retries: 1,
	use: {
		/** Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
		baseURL: 'https://support.theguardian.com',
	},
	reporter: 'html',

	/** We are using projects to split tests into priorities, and thus when they are run */
	projects: [
		/** This is an example of another project we might have, running pre-merge of a PR */
		// {
		// 	name: 'Pre-deploy'
		// },
		{
			name: 'smoke',
			testMatch: 'tests/smoke/*.test.ts',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			/** We run some tests on a Cron as they are sensitive to timeouts and limits from external services */
			name: 'cron',
			testMatch: 'tests/cron/*.test.ts',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
		},
	],
};

export default config;
