import { test, expect } from '@playwright/test';

let page;

test.beforeEach(async ({ browser }) => {
	const pageUrl = 'https://support.theguardian.com/uk/contribute';
	const browserContext = await browser.newContext();
	await browserContext.addCookies([
		{ name: '_post_deploy_user', value: 'true', url: pageUrl },
		{ name: 'GU_TK', value: '1.1', url: pageUrl },
	]);

	page = await browser.newPage();
	await page.goto(pageUrl);
});

test.describe('load support frontend homepage', () => {
	test('load homepage', async () => {
		const monthlyTab = '#MONTHLY';
		await expect(page.url()).toContain('/contribute');
		await expect(page.locator(monthlyTab)).toBeVisible();
	});
});
