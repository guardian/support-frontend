import { expect, test } from '@playwright/test';
import { afterEachTasks } from '../utils/afterEachTest';
import { setTestCookies } from '../utils/cookies';
import { firstName } from '../utils/users';

afterEachTasks(test);

test.describe('Paper product page', () => {
	test('Basic loading-when a user goes to the Newspapar Subscriptions page,it should display the page', async ({
		baseURL,
		context,
	}) => {
		const page = await context.newPage();
		const baseUrlWithFallback = baseURL ?? 'https://support.theguardian.com';
		const pageUrl = `${baseUrlWithFallback}/uk/subscribe/paper`;
		const domain = new URL(pageUrl).hostname;
		await setTestCookies(context, firstName(), domain);
		await page.goto(pageUrl);

		await expect(page.locator('id=qa-paper-subscriptions')).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Newspaper subscription' }).first(),
		).toBeVisible();
	});
});

test.describe('Weekly product page', () => {
	test('Basic loading-when a user goes to the Guardian Weekly page,it should display the page', async ({
		baseURL,
		context,
	}) => {
		const page = await context.newPage();
		const baseUrlWithFallback = baseURL ?? 'https://support.theguardian.com';
		const pageUrl = `${baseUrlWithFallback}/uk/subscribe/weekly`;
		const domain = new URL(pageUrl).hostname;
		await setTestCookies(context, firstName(), domain);
		await page.goto(pageUrl);

		await expect(page.locator('id=qa-guardian-weekly')).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'The Guardian Weekly' }).first(),
		).toBeVisible();
	});
});

test.describe('Weekly gift product page', () => {
	test('Basic loading-when a user goes to the Guardian Weekly gift page,it should display the page', async ({
		baseURL,
		context,
	}) => {
		const page = await context.newPage();
		const baseUrlWithFallback = baseURL ?? 'https://support.theguardian.com';
		const pageUrl = `${baseUrlWithFallback}/uk/subscribe/weekly/gift`;
		const domain = new URL(pageUrl).hostname;
		await setTestCookies(context, firstName(), domain);
		await page.goto(pageUrl);

		await expect(page.locator('id=qa-guardian-weekly-gift')).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Give the Guardian Weekly' }).first(),
		).toBeVisible();
	});
});

test.describe('Subscriptions landing page', () => {
	test('Basic loading-when a user goes to the Subscriptions landing page,it should display the page', async ({
		baseURL,
		context,
	}) => {
		const page = await context.newPage();
		const baseUrlWithFallback = baseURL ?? 'https://support.theguardian.com';
		const pageUrl = `${baseUrlWithFallback}/uk/subscribe`;
		const domain = new URL(pageUrl).hostname;
		await setTestCookies(context, firstName(), domain);
		await page.goto(pageUrl);

		await expect(
			page.locator('id=qa-subscriptions-landing-page'),
		).toBeVisible();
		await expect(
			page
				.getByRole('heading', {
					name: 'Support the Guardian with a print subscription',
				})
				.first(),
		).toBeVisible();
	});
});

test.describe('Contributions landing page', () => {
	test('Basic loading-when a user visits the root path it should redirect to the contributions landing page', async ({
		baseURL,
		context,
	}) => {
		const page = await context.newPage();
		const baseUrlWithFallback = baseURL ?? 'https://support.theguardian.com';
		const pageUrl = `${baseUrlWithFallback}/`;
		const domain = new URL(pageUrl).hostname;
		await setTestCookies(context, firstName(), domain);
		await page.goto(pageUrl);

		await expect(
			page.locator('id=supporter-plus-landing-page-uk'),
		).toBeVisible();
		const tabpanel = page.getByRole('tabpanel');
		expect(await tabpanel.locator(':scope > section').count()).toBe(3);
	});
});
