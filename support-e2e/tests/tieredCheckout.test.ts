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
	tier: 1 | 2 | 3;
	frequency: 'Monthly' | 'Annual';
	paymentType?: 'Credit/Debit card' | 'Direct debit' | 'PayPal';
	country?: 'US' | 'AU';
}

const testsDetails: TestDetails[] = [
	{ paymentType: 'Credit/Debit card', tier: 1, frequency: 'Monthly' },
	{ paymentType: 'Credit/Debit card', tier: 2, frequency: 'Annual' },
	{ paymentType: 'Direct debit', tier: 2, frequency: 'Monthly' },
	/**
	 * PayPal is currently throwing a "to many login attempts" error, so we're
	 * going to inactivate this test until we have a solution for it to avoid
	 * alert numbness.
	 *
	 * TODO - re-enable this test when PayPal is fixed
	 */
	// { paymentType: 'PayPal', tier: 2, frequency: 'Monthly' },
	{
		paymentType: 'Credit/Debit card',
		tier: 1,
		frequency: 'Monthly',
		country: 'US',
	},
];

const testDetailsPromo = [
	{
		tier: 2,
		frequency: 'Monthly',
		promoCode: 'PLAYWRIGHT_TEST_SPLUS_MONTHLY',
		expectedPromoText: '£8/month for 3 months, then £10/month',
		expectedCheckoutTotalText: 'Was £10, now £8/month',
		expectedCheckoutButtonText: 'Pay £8 per month',
		expectedThankYouText:
			"You'll pay £8/month for the first 3 months, then £10/month afterwards unless you cancel.",
	},
	{
		tier: 2,
		frequency: 'Annual',
		promoCode: 'PLAYWRIGHT_TEST_SPLUS_ANNUAL',
		expectedPromoText: '£76/year for the first year, then £95/year',
		expectedCheckoutTotalText: 'Was £95, now £76/year',
		expectedCheckoutButtonText: 'Pay £76 per year',
		expectedThankYouText:
			"You'll pay £76/year for the first year, then £95/year afterwards unless you cancel.",
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

test.describe('Subscribe (S+) incl PromoCode via the Tiered checkout', () => {
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
			await setupPage(
				page,
				context,
				baseURL,
				`/uk/contribute?promoCode=${testDetails.promoCode}`,
			);
			await page.getByRole('tab').getByText(testDetails.frequency).click();
			await expect(
				page.getByText(testDetails.expectedPromoText).first(),
			).toBeVisible();
			await page
				.locator(
					`:nth-match(button:has-text("Subscribe"), ${testDetails.tier})`,
				)
				.click();

			// Checkout
			await expect(
				page.getByText(testDetails.expectedCheckoutTotalText).first(),
			).toBeVisible();
			await setTestUserDetails(page, testFirstName, testLastName, testEmail);
			await page.getByRole('radio', { name: 'Credit/Debit card' }).check();
			await fillInCardDetails(page);
			await checkRecaptcha(page);
			await page.getByText(testDetails.expectedCheckoutButtonText).click();

			// Thank you
			await expect(
				page.getByText(testDetails.expectedThankYouText).first(),
			).toBeVisible();
			await expect(page).toHaveURL(
				`/uk/thankyou?promoCode=${testDetails.promoCode}`,
				{ timeout: 600000 },
			);
		});
	});
});

const thresholdTests = [
	{ amount: '10', contributionType: 'monthly', product: 'All-access digital' },
	{ amount: '9', contributionType: 'monthly', product: 'Support' },
	{ amount: '95', contributionType: 'annual', product: 'All-access digital' },
	{ amount: '94', contributionType: 'annual', product: 'Support' },
	{
		amount: '10',
		contributionType: 'monthly',
		promoCode: 'E2E_TEST_SPLUS_MONTHLY',
		product: 'All-access digital',
	},
	{
		amount: '9',
		contributionType: 'monthly',
		promoCode: 'E2E_TEST_SPLUS_MONTHLY',
		product: 'Support',
	},
	{
		amount: '95',
		contributionType: 'annual',
		promoCode: 'E2E_TEST_SPLUS_ANNUAL',
		product: 'All-access digital',
	},
	{
		amount: '94',
		contributionType: 'annual',
		promoCode: 'E2E_TEST_SPLUS_ANNUAL',
		product: 'Support',
	},
];
test.describe('Thresholds - the product is "Support" or "All-access digital" correctly based on selected-amount', () => {
	for (const testConfig of thresholdTests) {
		test(`Thresholds - ${testConfig.product} ${testConfig.amount}/${
			testConfig.contributionType
		}/${testConfig.promoCode ?? ''}`, async ({ context, baseURL }) => {
			const page = await context.newPage();
			const urlParams = new URLSearchParams({
				'selected-amount': testConfig.amount,
				'selected-contribution-type': testConfig.contributionType,
			});
			if (testConfig.promoCode) {
				urlParams.append('promoCode', testConfig.promoCode);
			}
			await setupPage(
				page,
				context,
				baseURL,
				`/uk/contribute/checkout?${urlParams.toString()}`,
			);

			const orderSummaryHeading = page.getByRole('heading', {
				name: 'Your subscription',
			});
			const orderSummarySection = page
				.locator('section')
				.filter({ has: orderSummaryHeading })
				.nth(1);

			expect(
				orderSummarySection.getByText(`${testConfig.product}`, { exact: true }),
			).toBeVisible();
		});
	}
});
