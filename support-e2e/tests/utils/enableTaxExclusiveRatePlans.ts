import type { BrowserContext } from '@playwright/test';

// Force skipping the new onboarding experience. This is WIP and we don't want
// it to interfere with the Playwright tests
export const enableCanadaTaxExclusion = async (context: BrowserContext) =>
	await context.addInitScript(() => {
		window.sessionStorage.setItem(
			'enableCanadaTaxExclusion',
			JSON.stringify({ value: 'On' }),
		);
	});
