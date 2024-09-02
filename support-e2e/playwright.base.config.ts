import { devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

export const baseObject: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: '**/*.test.ts',
	testIgnore: [
		'tests/smoke/**/*.test.ts',
		'tests/cron/**/*.test.ts',
		'tests/test/**/*.test.ts',
	],
	/* Maximum time one test can run for. */
	timeout: 120 * 1000,
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	retries: 1,
	use: {
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
