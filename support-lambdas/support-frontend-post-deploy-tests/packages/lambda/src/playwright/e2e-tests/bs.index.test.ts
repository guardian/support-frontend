// @ts-nocheck
require('dotenv').config();
const { expect } = require('@playwright/test');
const { chromium, devices } = require('playwright');

const cp = require('child_process');
const clientPlaywrightVersion = cp
	.execSync('npx playwright --version')
	.toString()
	.trim()
	.split(' ')[1];

(async () => {
	/*
	 * The following caps variable is for defining the BrowserStack specific capabilities
	 * The test will run in the browser/os combination is specified here
	 * The name of the test and also the build name goes here as well
	 * The credentials also need to be part of the caps as 'browserstack.username' and 'browserstack.accessKey'
	 */
	const caps = {
		browser: 'playwright-chromium', // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
		name: 'Test on Playwright emulated Pixel 5',
		build: 'playwright-build-4',
		'browserstack.username':
			process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME',
		'browserstack.accessKey':
			process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY',
		'client.playwrightVersion': clientPlaywrightVersion, // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
	};
	const browser = await chromium.connect({
		wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
			JSON.stringify(caps),
		)}`,
	});
	const context = await browser.newContext({ ...devices['Pixel 5'] }); // Complete list of devices - https://github.com/microsoft/playwright/blob/master/src/server/deviceDescriptors.js
	const page = await context.newPage();
	const pageUrl = 'https://support.theguardian.com/uk/contribute';
	await context.addCookies([
		{ name: '_post_deploy_user', value: 'true', url: pageUrl },
		{ name: 'GU_TK', value: '1.1', url: pageUrl },
	]);
	await page.goto(pageUrl);
	const monthlyTab = '#MONTHLY';
	expect(page.url()).toContain('/contribute');
	await expect(page.locator(monthlyTab)).toBeVisible();

	await browser.close();
})();
