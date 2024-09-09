import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { checkRecaptcha } from '../utils/recaptcha';
import { fillInCardDetails } from '../utils/cardDetails';
import { fillInDirectDebitDetails } from '../utils/directDebitDetails';
import { fillInPayPalDetails } from '../utils/paypal';
import { setupPage } from '../utils/page';

type TestDetails = {
	frequency: 'Monthly' | 'Quarterly' | 'Annual';
	paymentType: 'Credit/Debit card' | 'Direct debit' | 'PayPal';
};

export const testGuardianWeeklyCheckout = (testDetails: TestDetails) => {
	test(`Guardian Weekly - ${testDetails.frequency} - ${testDetails.paymentType} - GBP`, async ({
		context,
		baseURL,
	}) => {
		const page = await context.newPage();
		const testFirstName = firstName();
		const testEmail = email();
		await setupPage(page, context, baseURL, '/uk/subscribe/weekly');
		await page
			.locator(`a[aria-label='${testDetails.frequency}- Subscribe now']`)
			.click();
		await page.getByLabel('title').selectOption('Ms');
		await page.getByLabel('First name').fill(testFirstName);
		await page.getByLabel('Last name').fill(lastName());
		await page.getByLabel('Email', { exact: true }).fill(testEmail);
		await page.getByLabel('Confirm email').fill(testEmail);
		await page.getByLabel('Address Line 1').fill('Kings Place');
		await page.getByLabel('Address Line 2').fill('Kings Cross');
		await page.getByLabel('Town/City').fill('London');
		await page.getByLabel('Postcode').last().fill('N1 9GU');
		await page.getByRole('radio', { name: testDetails.paymentType }).check();
		switch (testDetails.paymentType) {
			case 'Credit/Debit card':
				await fillInCardDetails(page);
				await checkRecaptcha(page);
				await page.locator('button:has-text("Pay now")').click();
				break;
			case 'Direct debit':
				await fillInDirectDebitDetails(page, 'subscription');
				await page.locator('button:has-text("Confirm")').click();
				await checkRecaptcha(page);
				await page.locator('button:has-text("Subscribe")').click();
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
					.getByRole('button', { name: 'PayPal' })
					.click({ delay: 2000 });

				const popupPage = await popupPagePromise;
				fillInPayPalDetails(popupPage);
				break;
		}

		const getSuccessPackageTitle = () => {
			switch (testDetails.frequency) {
				case 'Quarterly':
					return ' / quarterly package';

				case 'Annual':
					return ' / annual package';

				default:
					return '';
			}
		};

		const subscribedMessage = `You have now subscribed to the Guardian Weekly${getSuccessPackageTitle()}`;
		const processingSubscriptionMessage = `Your subscription to the Guardian Weekly${getSuccessPackageTitle()} is being processed`;
		const successMsgRegex = new RegExp(
			`${processingSubscriptionMessage}|${subscribedMessage}`,
		);

		await expect(
			page.getByRole('heading', { name: successMsgRegex }),
		).toBeVisible({ timeout: 600000 });
	});
};
