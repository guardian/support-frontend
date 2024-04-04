import { BrowserContext, Page } from '@playwright/test';
import { setTestCookies } from './cookies';

export const setupPage = async (
	page: Page,
	context: BrowserContext,
	baseURL: string = 'https://support.theguardian.com',
	pathName: string,
) => {
	const pageUrl = `${baseURL}${pathName}`;
	const domain = new URL(pageUrl).hostname;
	/**
	 * It's important to use the value SupportPostDeployTestF
	 * as this is used to determine the test is a test user
	 * see: support-frontend/app/services/TestUserService.scala
	 **/
	await setTestCookies(context, 'SupportPostDeployTestF', domain);
	await page.goto(pageUrl);
};

/**
 * This is set to 35 seconds due to the 30 second timeout we have on the thank you screen displaying.
 * @see `POLLING_INTERVAL` and `MAX_POLLS` in {@link file://./../../support-frontend/assets/helpers/forms/paymentIntegrations/readerRevenueApis.ts}
 **/
export const THANK_YOU_PAGE_EXPECT_TIMEOUT = 35 * 1000;
