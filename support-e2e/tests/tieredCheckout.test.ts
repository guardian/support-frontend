import { expect, Page, test } from '@playwright/test';
import { email, firstName, lastName } from './utils/users';
import { checkRecaptcha } from './utils/recaptcha';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInDirectDebitDetails } from './utils/directDebitDetails';
import { fillInPayPalDetails } from './utils/paypal';
import { setupPage } from './utils/page';
import { afterEachTasks } from './utils/afterEachTest';
import {
	setTestUserDetails,
	setTestUserRequiredDetails,
} from './utils/testUserDetails';
import {
	ausWithFullAddress,
	ausWithStateOnly,
	personalDetailsOnly,
	TestFields,
	ukWithBillingAndPostalAddress,
	ukWithPostalAddressOnly,
	usWithPostalAddressOnly,
	usWithPostcodeAndState,
} from './utils/userFields';

export interface TestDetails {
	tier: 1 | 2 | 3;
	ratePlan: 'Monthly' | 'Annual';
	paymentType: 'Credit/Debit card' | 'Direct debit' | 'PayPal';
	fields: TestFields;
	internationalisationId: 'UK' | 'US' | 'AU';
}

export const testsDetails: TestDetails[] = [
	{
		tier: 1,
		ratePlan: 'Monthly',
		paymentType: 'Direct debit',
		fields: personalDetailsOnly(),
		internationalisationId: 'UK',
	},
	{
		tier: 1,
		ratePlan: 'Annual',
		paymentType: 'Credit/Debit card',
		fields: usWithPostcodeAndState(),
		internationalisationId: 'US',
	},
	{
		tier: 1,
		ratePlan: 'Monthly',
		paymentType: 'PayPal',
		fields: ausWithStateOnly(),
		internationalisationId: 'AU',
	},
	{
		tier: 2,
		ratePlan: 'Annual',
		paymentType: 'Credit/Debit card',
		fields: usWithPostcodeAndState(),
		internationalisationId: 'US',
	},
	{
		tier: 2,
		paymentType: 'Direct debit',
		ratePlan: 'Monthly',
		fields: personalDetailsOnly(),
		internationalisationId: 'UK',
	},
	{
		tier: 2,
		paymentType: 'PayPal',
		ratePlan: 'Monthly',
		fields: ausWithStateOnly(),
		internationalisationId: 'AU',
	},
	{
		tier: 3,
		paymentType: 'Credit/Debit card',
		ratePlan: 'Annual',
		fields: ausWithFullAddress(),
		internationalisationId: 'AU',
	},
	{
		tier: 3,
		paymentType: 'Direct debit',
		ratePlan: 'Monthly',
		fields: ukWithBillingAndPostalAddress(),
		internationalisationId: 'UK',
	},
	{
		tier: 3,
		paymentType: 'PayPal',
		ratePlan: 'Monthly',
		fields: usWithPostalAddressOnly(),
		internationalisationId: 'US',
	},
];

afterEachTasks(test);

test.describe('Contribute/Subscribe Tiered Checkout', () => {
	testsDetails.forEach((testDetails) => {
		test(`Tier-${testDetails.tier} ${testDetails.ratePlan} with ${testDetails.paymentType} - ${testDetails.internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			const page = await context.newPage();
			const testFirstName = firstName();
			const testLastName = lastName();
			const testEmail = email();
			const ctaCopy =
				testDetails.internationalisationId === 'US' ? 'Subscribe' : 'Support';

			await setupPage(
				page,
				context,
				baseURL,
				`/${
					testDetails.internationalisationId?.toLowerCase() || 'uk'
				}/contribute`,
			);

			await page.getByRole('tab').getByText(testDetails.ratePlan).click();
			await page
				.getByRole('link', { name: ctaCopy })
				.nth(testDetails.tier - 1)
				.click();
			await setTestUserDetails(
				page,
				testDetails.fields,
				testDetails.internationalisationId,
				testDetails.tier,
			);
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
					testDetails.ratePlan === 'Annual' ? 'year' : 'month';
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
test.describe('SupporterPlus promoCodes', () => {
	testDetailsPromo.forEach((testDetails) => {
		test(`Tier-${testDetails.tier} incl PromoCode ${testDetails.frequency} with Credit/Debit card - UK`, async ({
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
			await setTestUserRequiredDetails(
				page,
				testEmail,
				testFirstName,
				testLastName,
			);
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
