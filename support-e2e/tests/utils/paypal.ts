import 'dotenv/config';
import { Page } from '@playwright/test';

const paypalUsernamePrefixes = [
	'sb-uadtx34786338',
	'sb-8xque30655602',
	'sb-hk3ov30650585',
];

const getEnvVarOrThrow = (name: string) => {
	const envVar = process.env[name];

	if (envVar === undefined) {
		throw new Error(
			`Environment variable ${name} not set, I can't continue without it!`,
		);
	}

	return envVar;
};

export const fillInPayPalDetails = async (page: Page) => {
	const paypalUsernamePrefix =
		paypalUsernamePrefixes[
			Math.floor(Math.random() * paypalUsernamePrefixes.length)
		];

	const tryAgainLink = page.getByText('Please try again');

	if (await tryAgainLink.isVisible()) {
		await tryAgainLink.click();
	}

	const emailInput = page.locator('#email');

	await emailInput.fill(`${[paypalUsernamePrefix]}@personal.example.com`);

	const nextButton = page.locator('#btnNext');

	if (await nextButton.isVisible()) {
		await nextButton.click();
	}

	const passwordInput = page.locator('#password');

	const password = `${paypalUsernamePrefix}-${getEnvVarOrThrow(
		'PAYPAL_TEST_PASSWORD',
	)}`;

	await passwordInput.fill(password);

	const loginButton = page.locator('#btnLogin');

	if (await loginButton.isVisible()) {
		await loginButton.click();
	}

	const submitButton = page.locator('[data-id=payment-submit-btn]');

	await submitButton.click();
};
