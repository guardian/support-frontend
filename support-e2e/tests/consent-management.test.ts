import { expect, test } from '@playwright/test';

test('Should show a dismissable consent management banner', async ({
	context,
	baseURL,
}) => {
	const page = await context.newPage();
	await page.goto(`${baseURL}`);

	const consentManagementBanner = page.frameLocator(
		'[title="The Guardian consent message"]',
	);

	await expect(
		consentManagementBanner.getByRole('button', { name: 'No' }),
	).toBeVisible({ timeout: 50000 });
	await expect(
		consentManagementBanner.getByRole('button', { name: 'Yes' }),
	).toBeVisible();
	await consentManagementBanner.getByRole('button', { name: 'Yes' }).click();
	await expect(
		consentManagementBanner.getByRole('button', { name: 'No' }),
	).not.toBeVisible();
	await expect(
		consentManagementBanner.getByRole('button', { name: 'Yes' }),
	).not.toBeVisible();
});
