import 'dotenv/config';
import { Page } from '@playwright/test';

const paypalUsernamePrefixes = [
	'sb-pxv43g30517058',
	'sb-8xque30655602',
	'sb-hk3ov30650585',
];

export const fillInPayPalDetails = async (page: Page) => {
	const paypalUsernamePrefix =
		paypalUsernamePrefixes[
			Math.floor(Math.random() * paypalUsernamePrefixes.length)
		];
	await page
		.locator('#email')
		.fill(`${[paypalUsernamePrefix]}@personal.example.com`);
	const nextButton = page.locator('#btnNext');
	if (await nextButton.isVisible()) {
		await nextButton.click();
	}
	await page
		.locator('#password')
		.fill(`${paypalUsernamePrefix}-${process.env.PAYPAL_TEST_PASSWORD}`);
	const loginButton = page.locator('#btnLogin');
	if (await loginButton.isVisible()) {
		await loginButton.click();
	}
	await page.locator('#payment-submit-btn').click();
};
