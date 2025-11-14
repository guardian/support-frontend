import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const checkRecaptcha = async (page: Page) => {
	await expect(
		page.frameLocator('[title="reCAPTCHA"]').locator('#recaptcha-anchor-label'),
	).toBeVisible({
		timeout: 10000,
	});

	const recaptchaIframe = page.frameLocator('[title="reCAPTCHA"]');
	const recaptchaCheckbox = recaptchaIframe.locator(
		".recaptcha-checkbox[role='checkbox']",
	);
	await expect(recaptchaCheckbox).toBeEnabled();

	await recaptchaCheckbox.click({ force: true, noWaitAfter: true });

	await expect(
		recaptchaIframe.locator('#recaptcha-accessible-status'),
	).toContainText('You are verified');
};
