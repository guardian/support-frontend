import { devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

export const baseObject: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: '**/*.test.ts',

	/**
	 * Maximum time one test can run for.
	 *
	 * This is set to 40 seconds due to the thank you page timeout being 30 seconds allowing for
	 * {@link https://github.com/guardian/support-frontend/blob/62727c38f160e2effe83cbe990319ca05e12a777/support-frontend/assets/helpers/forms/paymentIntegrations/readerRevenueApis.ts#L248-L249}
	 * */
	timeout: 40 * 1000,
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	retries: 1,
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
