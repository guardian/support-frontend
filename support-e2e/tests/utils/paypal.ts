import 'dotenv/config';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

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
	await emailInput.fill(`${paypalUsernamePrefix}@personal.example.com`);

	// Sometimes the email and password inputs are split across two screens and
	// sometimes they're on the same screen. The playwright tests seem to always
	// get the two step experience, but just in case let's keep this flexible so
	// that playwright can handle the case where they appear on the same screen.
	// I.e. we only need to click the next button if it's there.
	const nextButton = page.getByRole('button', { name: 'Next' });
	if (await nextButton.isVisible()) {
		await nextButton.click();
	}

	const password = `${paypalUsernamePrefix}-${getEnvVarOrThrow(
		'PAYPAL_TEST_PASSWORD',
	)}`;

	const passwordInput = page.getByRole('textbox', { name: 'Password' });
	await passwordInput.waitFor({ state: 'visible' });
	await expect(passwordInput).toBeInViewport();
	await passwordInput.fill(password);

	const loginButton = page.getByRole('button', { name: 'Log In' });
	await loginButton.click();

	const submitButton = page.getByRole('button', { name: 'Agree and Continue' });
	await submitButton.click();
};
