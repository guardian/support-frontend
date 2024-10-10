import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { setupPage } from '../utils/page';
import { setTestUserRequiredDetails } from '../utils/testUserDetails';
import { fillInPayPalDetails } from '../utils/paypal';
import { fillInCardDetails } from '../utils/cardDetails';
import { checkRecaptcha } from '../utils/recaptcha';

type TestDetails = {
	paymentType: string;
	internationalisationId: string;
};

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
		await setTestUserRequiredDetails(page, testEmail);
		await page.getByRole('radio', { name: paymentType }).check();

		if (paymentType === 'Credit/Debit card') {
			await fillInCardDetails(page);
			await checkRecaptcha(page);
		}

		await page
			.getByRole('button', {
				name: ` with `,
			})
			.click();

		if (paymentType === 'PayPal') {
			await expect(page).toHaveURL(/.*paypal.com/, { timeout: 600000 });
			fillInPayPalDetails(page);
		}

		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});
	});
};
