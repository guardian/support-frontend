import { BrowserContext, expect } from '@playwright/test';

export const setTestCookies = async (
	context: BrowserContext,
	userName: string,
	domain: string,
) => {
	await context.addCookies([
		{ name: 'pre-signin-test-user', value: userName, domain, path: '/' },
		{ name: '_test_username', value: userName, domain, path: '/' },
		{ name: '_post_deploy_user', value: 'true', domain, path: '/' },
		{ name: 'GU_TK', value: '1.1', domain, path: '/' },
	]);
};

export const checkAbandonedBasketCookieExists = async (
	context: BrowserContext,
) => {
	const cookies = await context.cookies();
	expect(cookies.map((c) => c.name)).toContain('GU_CO_INCOMPLETE');
};

export const checkAbandonedBasketCookieRemoved = async (
	context: BrowserContext,
) => {
	const cookies = await context.cookies();
	expect(cookies.map((c) => c.name)).not.toContain('GU_CO_INCOMPLETE');
};
