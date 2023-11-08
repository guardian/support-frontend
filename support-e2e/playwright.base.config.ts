import { devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

export const baseObject: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: '**/*.test.ts',

	/* Maximum time one test can run for. */
	// timeout: 600 * 1000,
	timeout: 120 * 1000,
	expect: {
		timeout: 90000,
	},
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	retries: 3,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
		baseURL: 'https://support.theguardian.com',
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
			},
		},
	],
};
