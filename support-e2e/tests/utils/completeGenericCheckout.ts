import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { fillInCardDetails } from './cardDetails';
import { fillInDirectDebitDetails } from './directDebitDetails';
import { fillInPayPalDetails } from './paypal';
import { checkRecaptcha } from './recaptcha';
import { setTestUserDetails } from './testUserDetails';
import { getUserFields } from './userFields';

type TestDetails = {
	product: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
	ratePlan?: string;
};

const recaptchaAndSubmit = async (page: Page) => {
	await checkRecaptcha(page);
	await page
		.getByRole('button', {
			name: `Pay`,
		})
		.click();
};

export const completeGenericCheckout = async (
	page: Page,
	testDetails: TestDetails,
) => {
	const { product, internationalisationId, postCode, paymentType, ratePlan } =
		testDetails;
	await setTestUserDetails(
		page,
		product,
		internationalisationId,
		getUserFields(internationalisationId, postCode),
		ratePlan,
	);

	await page.getByRole('radio', { name: paymentType }).check();
	switch (paymentType) {
		case 'PayPal': {
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
			await fillInPayPalDetails(popupPage);
			break;
		}
		case 'Credit/Debit card':
			await fillInCardDetails(page);
			await recaptchaAndSubmit(page);
			break;
		case 'Direct debit':
			await fillInDirectDebitDetails(page);
			await recaptchaAndSubmit(page);
			break;
	}

	await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
		timeout: 600000,
	});
};
