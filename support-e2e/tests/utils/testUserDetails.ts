import { Page } from '@playwright/test';
import { TestDetails } from '../tieredCheckout.test';

export const setTestUserRequiredDetails = async (
	page: Page,
	email: string,
	firstName?: string,
	lastName?: string,
) => {
	await page.getByLabel('Email address').fill(email);
	if (firstName) {
		await page.getByLabel('First name').fill(firstName);
	}
	if (lastName) {
		await page.getByLabel('Last name').fill(lastName);
	}
};

export const setTestUserDetails = async (
	page: Page,
	testDetails: TestDetails,
) => {
	await setTestUserRequiredDetails(
		page,
		testDetails.fields.email,
		testDetails.fields.firstName,
		testDetails.fields.lastName,
	);

	if (testDetails.fields.addresses && testDetails.fields.addresses.length > 1) {
		await page
			.getByRole('checkbox', {
				name: 'Billing address same as delivery address',
			})
			.uncheck();
	}

	if (testDetails.fields.addresses) {
		let index = 0;
		// To run in sequence using async/await, for required over forEach
		for (const address of testDetails.fields.addresses) {
			if (
				testDetails.internationalisationId === 'US' ||
				testDetails.internationalisationId === 'AU'
			) {
				await page
					.getByLabel('State')
					.nth(index)
					.selectOption({ label: address.state });
			}

			if (address.postCode) {
				await page
					.getByLabel(
						testDetails.internationalisationId === 'US'
							? 'ZIP code'
							: 'Postcode',
					)
					// Skip UK postCode lookup component
					.nth(testDetails.internationalisationId ? index : index + 1)
					.fill(address.postCode);
			}

			if (testDetails.tier === 3) {
				await page
					.getByLabel(`Address Line 1`)
					.nth(index)
					.fill(address.firstLine ?? '');

				await page
					.getByLabel(`Town/City`)
					.nth(index)
					.fill(address.city ?? '');
			}
			index++;
		}
	}
};
