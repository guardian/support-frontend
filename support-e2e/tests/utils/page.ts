import type { BrowserContext, Page } from '@playwright/test';
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
