import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { setTestUserDetails } from './utils/testUserDetails';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInDirectDebitDetails } from './utils/directDebitDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';
import {
	checkAbandonedBasketCookieExists,
	checkAbandonedBasketCookieRemoved,
} from './utils/cookies';

interface TestDetails {
	tier: 1 | 2 | 3;
	frequency: 'Monthly' | 'Annual';
	paymentType?: 'Credit/Debit card' | 'Direct debit' | 'PayPal';
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
			const ctaCopy = testDetails.country === 'US' ? 'Subscribe' : 'Support';

			await setupPage(
				page,
				context,
				baseURL,
				`/${
					testDetails.country?.toLowerCase() || 'uk'
				}/contribute#ab-abandonedBasket=variant`, // remove once AB test is over
			);
			await page.getByRole('tab').getByText(testDetails.frequency).click();
			await page
				.getByRole('link', { name: ctaCopy })
				.nth(testDetails.tier - 1)
				.click();
			await checkAbandonedBasketCookieExists(context);
			await setTestUserDetails(page, testFirstName, testLastName, testEmail);
			if (testDetails.country === 'US') {
				await page.getByLabel('State').selectOption({ label: 'New York' });
				await page.getByLabel('ZIP code').fill('90210');
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
				// Define the variable for the time period
				const frequencyLabel =
					testDetails.frequency === 'Annual' ? 'year' : 'month';
				var paymentButtonRegex = new RegExp(
					'(Pay|Support us with) (£|\\$)([0-9]+|([0-9]+.[0-9]+)) per (' +
						frequencyLabel +
						')',
				);
				await page.getByText(paymentButtonRegex).click();
			}
			await expect(
				page.getByRole('heading', { name: 'Thank you' }),
			).toBeVisible({
				timeout: 600000,
			});
			await checkAbandonedBasketCookieRemoved(context);
		});
	});
});

const testDetailsPromo = [
	{
		tier: 2,
		frequency: 'Monthly',
		promoCode: 'E2E_TEST_SPLUS_MONTHLY',
		expectedCardHeading: 'All-access digital',
		expectedPromoText:
			/£(\d|\.)+\/month for (\d|\.) months, then £(\d|\.)+\/month/,
		expectedCheckoutTotalText: 'Was £12, now £9.60/month',
		expectedThankYouText:
			/You'll pay £(\d|\.)+\/month for the first (\d|\.)+ months, then £(\d|\.)+\/month afterwards unless you cancel\./,
	},
	{
		tier: 2,
		frequency: 'Annual',
		promoCode: 'E2E_TEST_SPLUS_ANNUAL',
		expectedCardHeading: 'All-access digital',
		expectedPromoText:
			/£(\d|\.)+\/year for the first year, then £(\d|\.)+\/year/i,
		expectedCheckoutTotalText: /Was £(\d|\.)+, now £(\d|\.)+\/year/i,
		expectedThankYouText:
			/You'll pay £(\d|\.)+\/year for the first year, then £(\d|\.)+\/year afterwards unless you cancel\./i,
	},
];
test.describe('Supporter Plus promoCodes', () => {
	testDetailsPromo.forEach((testDetails) => {
		test(`${testDetails.frequency} (S+) Subscription incl PromoCode at Tier-${testDetails.tier} with Credit/Debit card - UK`, async ({
			context,
			baseURL,
		}) => {
			// Landing
			const page = await context.newPage();
			const testFirstName = firstName();
			const testLastName = lastName();
			const testEmail = email();
			const ctaCopy = 'Support';

			await setupPage(
				page,
				context,
				baseURL,
				`/uk/contribute?promoCode=${testDetails.promoCode}`,
			);
			await page.getByRole('tab').getByText(testDetails.frequency).click();

			const cardHeading = page.getByRole('heading', {
				name: testDetails.expectedCardHeading,
			});
			const card = page.locator('section').filter({ has: cardHeading });
			await expect(
				card.getByText(testDetails.expectedPromoText).first(),
			).toBeVisible();
			await page
				.getByRole('link', { name: ctaCopy })
				.nth(testDetails.tier - 1)
				.click();

			// Checkout
			await expect(
				page.getByText(testDetails.expectedCheckoutTotalText).first(),
			).toBeVisible();
			await setTestUserDetails(page, testFirstName, testLastName, testEmail);
			await page.getByRole('radio', { name: 'Credit/Debit card' }).check();
			await fillInCardDetails(page);
			await checkRecaptcha(page);
			await page
				.getByRole('button', {
					name: `Pay`,
				})
				.click();

			// Thank you
			await expect(
				page.getByRole('heading', { name: 'Thank you' }),
			).toBeVisible({ timeout: 600000 });

			await expect(
				page.getByText(testDetails.expectedThankYouText).first(),
			).toBeVisible({ timeout: 600000 });
		});
	});
});
