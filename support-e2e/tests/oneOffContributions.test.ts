import { expect, test } from '@playwright/test';
import { email } from './utils/users';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';

interface TestDetails {
	paymentType: 'Credit/Debit card' | 'PayPal';
	customAmount?: string;
}

const testsDetails: TestDetails[] = [
	{ paymentType: 'Credit/Debit card', customAmount: '22.55' },
	/**
	 * PayPal is currently throwing a "to many login attempts" error, so we're
	 * going to inactivate this test until we have a solution for it to avoid
	 * alert numbness.
	 *
	 * TODO - re-enable this test when PayPal is fixed
	 */
	// { paymentType: 'PayPal' },
];

afterEachTasks(test);

test.describe('Sign up for a one-off contribution', () => {
	testsDetails.forEach((testDetails) => {
		test(`One off contribution ${
			testDetails.customAmount
				? `with custom amount ${testDetails.customAmount} `
				: ''
		}checkout with ${testDetails.paymentType} - GBP`, async ({
			context,
			baseURL,
		}) => {
			const page = await context.newPage();
			await setupPage(page, context, baseURL, '/uk/contribute');
			await page.getByRole('button', { name: 'Support now' }).click();
			await expect(page).toHaveURL(/\/uk\/contribute\/checkout/);
			if (testDetails.customAmount) {
				await page.locator("label[for='amount-other']").click();
				await page.getByLabel('Enter your amount').fill('22.55');
			}
			await page.getByLabel('Email address').fill(email());
			await page.getByRole('radio', { name: testDetails.paymentType }).click();
			switch (testDetails.paymentType) {
				case 'Credit/Debit card':
					await fillInCardDetails(page);
					await checkRecaptcha(page);
					await page.locator('button:has-text("Support us with")').click();
					break;
				case 'PayPal':
					await page.getByText(/Pay (£|\$)([0-9]+) with PayPal/).click();
					await expect(page).toHaveURL(/.*paypal.com/);
					fillInPayPalDetails(page);
					break;
			}
			await expect(page).toHaveURL(/\/uk\/thankyou/);
		});
	});
});
