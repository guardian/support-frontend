import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { setTestUserRequiredDetails } from './utils/testUserDetails';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInDirectDebitDetails } from './utils/directDebitDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';

const testDetails = [
	{
		product: 'SupporterPlus',
		ratePlan: 'Monthly',
		paymentType: 'PayPal',
		internationalisationId: 'au',
		paymentFrequency: 'month',
	},
	{
		product: 'SupporterPlus',
		ratePlan: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'eu',
		paymentFrequency: 'year',
	},
] as const;

afterEachTasks(test);

test.describe('Generic Checkout', () => {
	testDetails.forEach((testDetails) => {
		const { internationalisationId, product, ratePlan, paymentType } =
			testDetails;

		test(`${product} ${ratePlan} with ${paymentType} in ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			const url = `/${internationalisationId}/checkout?product=${product}&ratePlan=${ratePlan}`;
			const page = await context.newPage();
			const testFirstName = firstName();
			const testLastName = lastName();
			const testEmail = email();
			await setupPage(page, context, baseURL, url);

			await setTestUserRequiredDetails(
				page,
				testFirstName,
				testLastName,
				testEmail,
			);
			if (internationalisationId === 'au') {
				await page
					.getByLabel('State')
					.selectOption({ label: 'New South Wales' });
			}
			await page.getByRole('radio', { name: paymentType }).check();
			switch (paymentType) {
				case 'PayPal':
					const popupPagePromise = page.waitForEvent('popup');
					await page
						.locator("iframe[name^='xcomponent__ppbutton']")
						.scrollIntoViewIfNeeded();
					await page
						.frameLocator("iframe[name^='xcomponent__ppbutton']")
						// this class gets added to the iframe body after the JavaScript has finished executing
						.locator('body.dom-ready')
						.locator('[role="button"]:has-text("Pay with")')
						.click({ delay: 2000 });
					const popupPage = await popupPagePromise;
					fillInPayPalDetails(popupPage);
					break;
				case 'Credit/Debit card':
				default:
					await fillInCardDetails(page);
					break;
			}

			if (paymentType === 'Credit/Debit card') {
				await checkRecaptcha(page);
				await page
					.getByRole('button', {
						name: `Pay`,
					})
					.click();
			}

			await expect(
				page.getByRole('heading', { name: 'Thank you' }),
			).toBeVisible({ timeout: 600000 });
		});
	});
});
