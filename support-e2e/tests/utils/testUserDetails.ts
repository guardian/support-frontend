import { Page } from '@playwright/test';
import { TestDetails } from '../tieredCheckout.test';

export const setTestUserRequiredDetails = async (
	page: Page,
	firstName: string,
	lastName: string,
	email: string,
) => {
	await page.getByLabel('Email address').fill(email);
	await page.getByLabel('First name').fill(firstName);
	await page.getByLabel('Last name').fill(lastName);
};

export const setTestUserDetails = async (
	page: Page,
	testDetails: TestDetails,
) => {
	const addressPrefix = testDetails.deliveryBillingAddressDiffer
		? 'billing'
		: 'delivery';

	await setTestUserRequiredDetails(
		page,
		testDetails.fields.firstName,
		testDetails.fields.lastName,
		testDetails.fields.email,
	);

	if (testDetails.country === 'US' || testDetails.country === 'AU') {
		await page
			.getByLabel('State')
			.selectOption({ label: testDetails.fields.state });
		if (testDetails.country === 'US') {
			await page.getByLabel('ZIP code').fill(testDetails.fields.postCode ?? '');
		}
	}

	if (testDetails.tier === 3) {
		await page
			.getByLabel(testDetails.country === 'US' ? 'ZIP code' : 'Postcode')
			.last()
			.fill(testDetails.fields.postCode ?? '');

		await page
			.getByLabel(`Address Line 1`)
			.fill(testDetails.fields.firstLine ?? '');

		await page.getByLabel(`Town/City`).fill(testDetails.fields.city ?? '');
	}
};
