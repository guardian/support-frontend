import { expect, test } from '@playwright/test';

test('Should show a dismissable consent management banner', async ({
	context,
	baseURL,
}) => {
	const page = await context.newPage();
	await page.goto(`${baseURL}/uk/contribute`);
	await page.evaluate(() =>
		window.localStorage.setItem(
			'gu.geo.override',
			JSON.stringify({ value: 'GB' }),
		),
	);
	await page.reload();

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
