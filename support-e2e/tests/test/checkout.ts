import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { setupPage } from '../utils/page';
import { setTestUserRequiredDetails } from '../utils/testUserDetails';
import { fillInPayPalDetails } from '../utils/paypal';
import { fillInCardDetails } from '../utils/cardDetails';
import { checkRecaptcha } from '../utils/recaptcha';

type TestDetails = {
	product: string;
	ratePlan: string;
	paymentType: string;
	internationalisationId: string;
	paymentFrequency: string;
};

export const testCheckout = (testDetails: TestDetails) => {
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
			testEmail,
			testFirstName,
			testLastName,
		);

		if (internationalisationId === 'au') {
			await page.getByLabel('State').selectOption({ label: 'New South Wales' });
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

		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});
	});
};
