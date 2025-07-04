import { expect, Page, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { setupPage } from '../utils/page';
import { fillInPayPalDetails } from '../utils/paypal';
import { fillInCardDetails } from '../utils/cardDetails';
import { checkRecaptcha } from '../utils/recaptcha';
import {
	ausWithFullAddress,
	intWithPostalAddressOnly,
	TestFields,
	ukWithPostalAddressOnly,
	usWithPostalAddressOnly,
} from '../utils/userFields';
import {
	setTestUserAddressDetails,
	setTestUserDetails,
} from '../utils/testUserDetails';

// TODO: it'd be great to make the types here more specific, possibly using the
// shared types from the product catalog.
type TestDetails = {
	product: string;
	ratePlan: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
};

const userDetails = (
	product: string,
	internationalisationId: string,
): TestFields => {
	switch (internationalisationId) {
		case 'UK':
			return ukWithPostalAddressOnly();
		case 'US':
			return usWithPostalAddressOnly();
		case 'AU':
			return ausWithFullAddress();
		case 'INT':
			return intWithPostalAddressOnly();
		default:
			throw new Error(
				`Couldn't find user details for ${product} in ${internationalisationId}`,
			);
	}
};

const setUserDetailsForProduct = async (
	page,
	product,
	internationalisationId,
	postCode,
) => {
	switch (product) {
		case 'SupporterPlus':
		case 'GuardianAdLite':
			await setTestUserDetails(page, email(), firstName(), lastName(), true);

			break;
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
		case 'TierThree':
			await setTestUserAddressDetails(
				page,
				userDetails(product, internationalisationId),
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
				ukWithPostalAddressOnly(),
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
				ukWithPostalAddressOnly(postCode),
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

export const testCheckout = (testDetails: TestDetails) => {
	const { internationalisationId, product, ratePlan, paymentType, postCode } =
		testDetails;
	const testName = `${product} ${ratePlan} with ${paymentType} in ${internationalisationId} ${
		postCode ? `with postcode ${postCode}` : ''
	}`;

	test(testName, async ({ context, baseURL }) => {
		const urlProductKey =
			product === 'NationalDelivery' ? 'HomeDelivery' : product;
		const url = `/${internationalisationId.toLowerCase()}/checkout?product=${urlProductKey}&ratePlan=${ratePlan}`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, url);

		await completeCheckout(page, testDetails);
	});
};

export const completeCheckout = async (page, testDetails: TestDetails) => {
	const { product, internationalisationId, postCode, paymentType } =
		testDetails;
	await setUserDetailsForProduct(
		page,
		product,
		internationalisationId,
		postCode,
	);

	// State mandatory for AU and US
	if (internationalisationId === 'AU') {
		await page.getByLabel('State').selectOption({ label: 'New South Wales' });
	}
	if (internationalisationId === 'US') {
		await page.getByLabel('State').selectOption({ label: 'Illinois' });
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
			await checkRecaptcha(page);
			await page
				.getByRole('button', {
					name: `Pay`,
				})
				.click();
			break;
	}

	await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
		timeout: 600000,
	});
};
