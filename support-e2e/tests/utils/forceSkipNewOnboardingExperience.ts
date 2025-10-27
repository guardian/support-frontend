import type { Page } from '@playwright/test';

// Force skipping the new onboarding experience. This is WIP and we don't want
// it to interfere with the Playwright tests
export const forceSkipNewOnboardingExperience = async (page: Page) =>
	await page.evaluate(() =>
		window.sessionStorage.setItem(
			'gu.skipNewOnboardingExperience',
			JSON.stringify({ value: 'true' }),
		),
	);
