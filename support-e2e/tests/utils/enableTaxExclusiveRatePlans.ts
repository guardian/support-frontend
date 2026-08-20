import type { BrowserContext } from '@playwright/test';

export const enableCanadaTaxExclusion = async (context: BrowserContext) =>
	await context.addInitScript(() => {
		window.sessionStorage.setItem(
			'enableCanadaTaxExclusion',
			JSON.stringify({ value: 'On' }),
		);
	});
