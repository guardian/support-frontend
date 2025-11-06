import type { BrowserContext } from '@playwright/test';

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
