import { Page, expect } from '@playwright/test';
import { fillInCardDetails } from './cardDetails';
import { fillInPayPalDetails } from './paypal';
import { checkRecaptcha } from './recaptcha';
import {
	setTestUserAddressDetails,
	setTestUserDetails,
} from './testUserDetails';
import { getUserFields } from './userFields';
import { email, firstName, lastName } from './users';
import { fillInDirectDebitDetails } from './directDebitDetails';

const selectDeliveryAgent = async (page: Page) => {
	// Depending on whether there are one or multiple delivery agents we need to do different things here.
	// If there are multiple delivery agents, we need to select one of them, if there is only one we do not.
	const deliveryAgentLabel = page.locator(
		'div:text-matches("Delivery provider|Select delivery provider")', // This will match both labels
	);
	await deliveryAgentLabel.waitFor({ state: 'visible' });

	const deliveryAgentRadioButton = page.locator(
		'fieldSet#delivery-provider input[type="radio"]',
	);

	if ((await deliveryAgentRadioButton.count()) > 0) {
		// If there are multiple delivery agents, select the first one
		await deliveryAgentRadioButton.first().check();
	}
};

const setUserDetailsForProduct = async (
	page,
	product,
	internationalisationId,
	postCode,
) => {
	switch (product) {
		case 'Contribution':
		case 'SupporterPlus':
		case 'GuardianAdLite':
		case 'DigitalSubscription':
			await setTestUserDetails(page, email(), firstName(), lastName(), true);

			break;
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
		case 'TierThree':
			await setTestUserAddressDetails(
				page,
				getUserFields(internationalisationId),
				internationalisationId,
				3,
			);

			break;
		case 'HomeDelivery':
			if (internationalisationId !== 'UK') {
				throw new Error(
					`Home delivery is only available in the UK, but got ${internationalisationId}`,
				);
			}

			await setTestUserAddressDetails(
				page,
				getUserFields(internationalisationId),
				internationalisationId,
				3,
			);

			break;
		case 'NationalDelivery':
			if (internationalisationId !== 'UK') {
				throw new Error(
					`National delivery is only available in the UK, but got ${internationalisationId}`,
				);
			}

			await setTestUserAddressDetails(
				page,
				getUserFields(internationalisationId, postCode),
				internationalisationId,
				3,
			);
			await selectDeliveryAgent(page);

			break;
		default:
			throw new Error(
				`I don't know how to fill in user details for ${product}`,
			);
	}
};

type TestDetails = {
	product: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
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
	page,
	testDetails: TestDetails,
) => {
	const { product, internationalisationId, postCode, paymentType } =
		testDetails;
	await setUserDetailsForProduct(
		page,
		product,
		internationalisationId,
		postCode,
	);

	const state = getUserFields(internationalisationId).addresses[0].state;
	if (state) {
		await page
			.getByLabel(internationalisationId === 'CA' ? 'Province' : 'State')
			.selectOption({ label: state });
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
