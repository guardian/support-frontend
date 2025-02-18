import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { setupPage } from '../utils/page';
import { setTestUserRequiredDetails } from '../utils/testUserDetails';
import { fillInPayPalDetails } from '../utils/paypal';
import {
	fillInCardDetails,
	fillInDeclinedCardDetails,
} from '../utils/cardDetails';
import { checkRecaptcha } from '../utils/recaptcha';

type TestDetails = {
	paymentType: string;
	internationalisationId: string;
};

const submitForm = (page) =>
	page
		.getByRole('button', {
			name: ` with `,
		})
		.click();

export const testOneTimeCheckout = (testDetails: TestDetails) => {
	const { internationalisationId, paymentType } = testDetails;
	test(`OneTime with ${paymentType} in ${internationalisationId}`, async ({
		context,
		baseURL,
	}) => {
		const url = `/${internationalisationId}/one-time-checkout`;
		const page = await context.newPage();
		const testEmail = email();
		await setupPage(page, context, baseURL, url);
		await setTestUserRequiredDetails(
			page,
			testEmail,
			undefined,
			undefined,
			true,
		);
		await page.getByRole('radio', { name: paymentType }).check();

		if (paymentType === 'Credit/Debit card') {
			// First check that a failed card payment behaves as expected
			await fillInDeclinedCardDetails(page);
			await checkRecaptcha(page);

			await submitForm(page);

			await expect(page.getByText('Sorry, something went wrong')).toBeVisible({
				timeout: 30000,
			});

			// Now fill in with good card details
			await fillInCardDetails(page);
			await checkRecaptcha(page);
		}

		await submitForm(page);

		if (paymentType === 'PayPal') {
			await expect(page).toHaveURL(/.*paypal.com/, { timeout: 600000 });
			fillInPayPalDetails(page);
		}

		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});
	});
};
