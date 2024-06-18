import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { setTestUserDetails } from './utils/testUserDetails';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInDirectDebitDetails } from './utils/directDebitDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';

const testDetails = [
	{
		product: 'Contribution',
		ratePlan: 'Monthly',
		paymentType: 'Direct debit',
		price: 9,
		country: 'UK',
		glyph: '£',
		paymentFrequency: 'month',
	},
	{
		product: 'Contribution',
		ratePlan: 'Annual',
		paymentType: 'Credit/Debit card',
		price: 90,
		country: 'US',
		glyph: '$',
		paymentFrequency: 'year',
	},
	{
		product: 'SupporterPlus',
		ratePlan: 'Monthly',
		paymentType: 'PayPal',
		price: 17,
		country: 'AU',
		glyph: '$',
		paymentFrequency: 'month',
	},
	{
		product: 'SupporterPlus',
		ratePlan: 'Annual',
		paymentType: 'Credit/Debit card',
		price: 95,
		country: 'EU',
		glyph: '€',
		paymentFrequency: 'year',
	},
] as const;

afterEachTasks(test);

test.describe('Generic Checkout', () => {
	testDetails.forEach((testDetails) => {
		test(`${testDetails.product} ${testDetails.ratePlan} with ${
			testDetails.paymentType
		} - ${testDetails.country ?? 'UK'} / ${testDetails.glyph}${
			testDetails.price
		}`, async ({ context, baseURL }) => {
			const page = await context.newPage();
			const testFirstName = firstName();
			const testLastName = lastName();
			const testEmail = email();
			await setupPage(
				page,
				context,
				baseURL,
				`/${testDetails.country?.toLowerCase() || 'uk'}/checkout?product=${
					testDetails.product
				}&ratePlan=${
					testDetails.ratePlan
				}&price=${testDetails.price.toString()}`,
			);

			await setTestUserDetails(page, testFirstName, testLastName, testEmail);
			if (testDetails.country === 'US') {
				await page.getByLabel('State').selectOption({ label: 'New York' });
				await page.getByLabel('ZIP code').fill('90210');
			}
			if (testDetails.country === 'AU') {
				await page
					.getByLabel('State')
					.selectOption({ label: 'New South Wales' });
			}
			await page.getByRole('radio', { name: testDetails.paymentType }).check();
			switch (testDetails.paymentType) {
				case 'Direct debit':
					await fillInDirectDebitDetails(page, 'contribution');
					await checkRecaptcha(page);
					break;
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

			if (
				testDetails.paymentType === 'Credit/Debit card' ||
				testDetails.paymentType === 'Direct debit'
			) {
				await checkRecaptcha(page);
				await page
					.getByRole('button', {
						name: `Pay ${testDetails.glyph}${testDetails.price} per ${testDetails.paymentFrequency}`,
					})
					.click();
			}

			await expect(
				page.getByRole('heading', { name: 'Thank you' }),
			).toBeVisible({ timeout: 600000 });
		});
	});
});
