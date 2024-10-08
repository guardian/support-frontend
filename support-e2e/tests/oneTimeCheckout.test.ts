import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { setTestUserRequiredDetails } from './utils/testUserDetails';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';

/** These have been covered in smoke/cron tests */
const testDetails = [
	{
		paymentType: 'PayPal',
		internationalisationId: 'uk',
		paymentFrequency: 'ONE_OFF',
	},
	{
		paymentType: 'Credit/Debit card',
		internationalisationId: 'us',
		paymentFrequency: 'ONE_OFF',
	},
] as const;

afterEachTasks(test);

test.describe('Generic One-Time Checkout', () => {
	testDetails.forEach((testDetails) => {
		const { internationalisationId, paymentType } = testDetails;

		test(`OneTime with ${paymentType} in ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			const url = `/${internationalisationId}/one-time-checkout`;
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
			if (internationalisationId === 'us') {
				await page.getByLabel('State').selectOption({ label: 'New York' });
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
						.locator('[role="button"]:has-text("with PayPal")')
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
						name: `Support`,
					})
					.click();
			}

			await expect(
				page.getByRole('heading', { name: 'Thank you' }),
			).toBeVisible({ timeout: 600000 });
		});
	});
});
