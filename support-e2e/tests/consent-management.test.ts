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
		consentManagementBanner
			// We use this role check as this text exists in the legal copy too
			.getByRole('button')
			.getByText('Manage or reject cookies'),
	).toBeVisible({ timeout: 50000 });
	await expect(
		consentManagementBanner.getByText('Yes, I’m happy'),
	).toBeVisible();
	await consentManagementBanner.getByText('Yes, I’m happy').click();
	await expect(
		consentManagementBanner.getByText('Manage or reject cookies'),
	).not.toBeVisible();
	await expect(
		consentManagementBanner.getByText('Yes, I’m happy'),
	).not.toBeVisible();
});
