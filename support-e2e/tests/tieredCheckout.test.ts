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
	paymentType: 'Credit/Debit card' | 'Direct debit' | 'PayPal';
	tier: 1 | 2 | 3;
	frequency: 'Monthly' | 'Annual';
	country?: 'US' | 'AU';
}

const testsDetails: TestDetails[] = [
	{ paymentType: 'Credit/Debit card', tier: 1, frequency: 'Monthly' },
	{ paymentType: 'Credit/Debit card', tier: 2, frequency: 'Annual' },
	{ paymentType: 'Direct debit', tier: 2, frequency: 'Monthly' },
	{ paymentType: 'PayPal', tier: 2, frequency: 'Monthly' },
	{
		paymentType: 'Credit/Debit card',
		tier: 1,
		frequency: 'Monthly',
		country: 'US',
	},
];

afterEachTasks(test);

test.describe('Subscribe/Contribute via the Tiered checkout)', () => {
	testsDetails.forEach((testDetails) => {
		test(`${testDetails.frequency} Subscription/Contribution at Tier-${
			testDetails.tier
		} with ${testDetails.paymentType} - ${
			testDetails.country ?? 'UK'
		}`, async ({ context, baseURL }) => {
			const page = await context.newPage();
			const testFirstName = firstName();
			const testLastName = lastName();
			const testEmail = email();
			await setupPage(
				page,
				context,
				baseURL,
				`/${testDetails.country?.toLowerCase() || 'uk'}/contribute`,
			);
			await page.getByRole('tab').getByText(testDetails.frequency).click();
			await page
				.locator(
					`:nth-match(button:has-text("Subscribe"), ${testDetails.tier})`,
				)
				.click();
			await setTestUserDetails(page, testFirstName, testLastName, testEmail);
			if (testDetails.country === 'US') {
				await page.getByLabel('State').selectOption({ label: 'New York' });
				await page.getByLabel('ZIP code').fill('90210');
			}
			await page.getByRole('radio', { name: testDetails.paymentType }).check();
			switch (testDetails.paymentType) {
				case 'Credit/Debit card':
					await fillInCardDetails(page);
					break;
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
			}
			if (
				testDetails.paymentType === 'Credit/Debit card' ||
				testDetails.paymentType === 'Direct debit'
			) {
				await checkRecaptcha(page);
				// Define the variable for the time period
				const frequencyLabel =
					testDetails.frequency === 'Annual' ? 'year' : 'month';
				var paymentButtonRegex = new RegExp(
					'(Pay|Support us with) (£|\\$)([0-9]+) per (' + frequencyLabel + ')',
				);
				await page.getByText(paymentButtonRegex).click();
			}
			await expect(page).toHaveURL(
				`/${testDetails.country?.toLowerCase() || 'uk'}/thankyou`,
				{ timeout: 600000 },
			);
		});
	});
});
