import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { afterEachTasks } from './utils/afterEachTest';
import { fillInCardDetails } from './utils/cardDetails';
import { fillInDirectDebitDetails } from './utils/directDebitDetails';
import { setupPage } from './utils/page';
import { fillInPayPalDetails } from './utils/paypal';
import { checkRecaptcha } from './utils/recaptcha';
import { email, firstName, lastName } from './utils/users';

interface TestDetails {
	frequency: 'Every day' | 'Weekend' | 'Six day' | 'Saturday' | 'Sunday';
	paymentType: 'Credit/Debit card' | 'Direct debit' | 'Paypal';
}

const testsDetails: TestDetails[] = [
	{
		frequency: 'Every day',
		paymentType: 'Credit/Debit card',
	},
	{
		frequency: 'Every day',
		paymentType: 'Direct debit',
	},
	{
		frequency: 'Every day',
		paymentType: 'Paypal',
	},
	{
		frequency: 'Weekend',
		paymentType: 'Credit/Debit card',
	},
	{
		frequency: 'Weekend',
		paymentType: 'Direct debit',
	},
	{
		frequency: 'Six day',
		paymentType: 'Credit/Debit card',
	},
	{
		frequency: 'Six day',
		paymentType: 'Direct debit',
	},
	{
		frequency: 'Saturday',
		paymentType: 'Credit/Debit card',
	},
	{
		frequency: 'Saturday',
		paymentType: 'Direct debit',
	},
	{
		frequency: 'Sunday',
		paymentType: 'Credit/Debit card',
	},
	{
		frequency: 'Sunday',
		paymentType: 'Direct debit',
	},
];

afterEachTasks(test);

test.describe('Sign up newspaper subscription', () => {
	testsDetails.forEach((testDetails) => {
		test(`Home delivery - ${testDetails.frequency} - ${testDetails.paymentType} - GBP`, async ({
			context,
			baseURL,
		}) => {
			if (
				testDetails.paymentType === 'Paypal' &&
				!process.env.PAYPAL_TEST_PASSWORD
			) {
				test.skip();
			}
			const page = await context.newPage();
			const testFirstName = firstName();
			const testEmail = email();
			await setupPage(page, context, baseURL, '/uk/subscribe/paper');
			await page
				.locator(`a[aria-label='${testDetails.frequency}- Subscribe']`)
				.click();
			await page.getByLabel('title').selectOption('Ms');
			await page.fill('label:has-text("First name")', testFirstName);
			await page.fill('label:has-text("Last name")', lastName());
			await page.fill('label:has-text("Email")', testEmail);
			await page.fill('label:has-text("Confirm email")', testEmail);
			await page.fill('label:has-text("Postcode")', 'N1 9GU');
			await page.fill('label:has-text("Address Line 1")', 'Kings Place');
			await page.fill('label:has-text("Address Line 2")', 'Kings Cross');
			await page.fill('label:has-text("Town/City")', 'London');
			await page.getByRole('radio', { name: testDetails.paymentType }).check();

			switch (testDetails.paymentType) {
				case 'Credit/Debit card':
					await fillInCardDetails(page);
					await checkRecaptcha(page);
					await page.getByRole('button', { name: 'Pay now' }).click();
					break;
				case 'Direct debit':
					await fillInDirectDebitDetails(page);
					await page.locator('button:has-text("Confirm")').click();
					await checkRecaptcha(page);
					await page.locator('button:has-text("Subscribe")').click();
					break;
				case 'Paypal': {
					const popupPagePromise = page.waitForEvent('popup');
					await page
						.locator("iframe[name^='xcomponent__ppbutton']")
						.scrollIntoViewIfNeeded();
					await page
						.frameLocator("iframe[name^='xcomponent__ppbutton']")
						// this class gets added to the iframe body after the JavaScript has finished executing
						.locator('body.dom-ready')
						.getByRole('button', { name: 'PayPal' })
						.click({ delay: 2000 });
					const popupPage = await popupPagePromise;
					await fillInPayPalDetails(popupPage);
					break;
				}
			}

			const subscribedMessage = `You have now subscribed to the ${testDetails.frequency} package`;
			const processingSubscriptionMessage = `Your subscription to the ${testDetails.frequency} package is being processed`;
			const successMsgRegex = new RegExp(
				`${processingSubscriptionMessage}|${subscribedMessage}`,
			);

			await expect(
				page.getByRole('heading', { name: successMsgRegex }),
			).toBeVisible({ timeout: 600000 });
		});
	});
});
