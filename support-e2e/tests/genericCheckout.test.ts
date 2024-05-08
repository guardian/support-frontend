import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { setTestUserDetails } from './utils/testUserDetails';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInDirectDebitDetails } from './utils/directDebitDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';

interface TestDetails {
	product: 'Contribution' | 'SupporterPlus';
	ratePlan: 'Monthly' | 'Annual';
	paymentType?: 'Stripe' | 'DirectDebit' | 'PayPal';
	price: number;
	country?: 'UK' | 'US' | 'AU' | 'EU';
}

const glyphs: Record<'UK' | 'US' | 'AU' | 'EU', string> = {
	UK: '£',
	US: '$',
	AU: '$',
	EU: '€',
};

const testDetails: TestDetails[] = [
	{
		product: 'Contribution',
		ratePlan: 'Monthly',
		paymentType: 'Stripe',
		price: 3,
	},
	{
		product: 'Contribution',
		ratePlan: 'Monthly',
		paymentType: 'DirectDebit',
		price: 9,
	},
	{
		product: 'Contribution',
		ratePlan: 'Annual',
		paymentType: 'Stripe',
		price: 90,
		country: 'US',
	},
	{
		product: 'SupporterPlus',
		ratePlan: 'Monthly',
		paymentType: 'Stripe',
		price: 17,
		country: 'AU',
	},
	{
		product: 'SupporterPlus',
		ratePlan: 'Annual',
		paymentType: 'DirectDebit',
		price: 95,
	},
	{
		product: 'SupporterPlus',
		ratePlan: 'Annual',
		paymentType: 'Stripe',
		price: 95,
		country: 'EU',
	},
];

afterEachTasks(test);

test.describe('Generic Checkout', () => {
	testDetails.forEach((testDetails) => {
		test(`${testDetails.product} ${testDetails.ratePlan} with ${
			testDetails.paymentType
		} - ${testDetails.country ?? 'UK'} / ${
			glyphs[testDetails.country || 'UK']
		}${testDetails.price}`, async ({ context, baseURL }) => {
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
			await page.getByRole('radio', { name: testDetails.paymentType }).check();
			switch (testDetails.paymentType) {
				case 'DirectDebit':
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
				case 'Stripe':
				default:
					await fillInCardDetails(page);
					break;
			}

			if (
				testDetails.paymentType === 'Stripe' ||
				testDetails.paymentType === 'DirectDebit'
			) {
				await checkRecaptcha(page);
				await page.getByRole('button', { name: 'Pay now' }).click();
			}

			await expect(page).toHaveURL(
				`/${testDetails.country?.toLowerCase() || 'uk'}/thank-you`,
				{ timeout: 600000 },
			);
		});
	});
});
