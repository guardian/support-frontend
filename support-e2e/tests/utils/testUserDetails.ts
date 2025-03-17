import { Page } from '@playwright/test';
import { TestFields } from './userFields';

export const setTestUserPersonalDetails = async (
	page: Page,
	email: string,
	confirmEmail?: string,
	firstName?: string,
	lastName?: string,
) => {
	await page.getByLabel('Email address', { exact: true }).fill(email);
	if (confirmEmail) {
		await page
			.getByLabel('Confirm email address', { exact: true })
			.fill(confirmEmail);
	}
	if (firstName) {
		await page.getByLabel('First name').fill(firstName);
	}
	if (lastName) {
		await page.getByLabel('Last name').fill(lastName);
	}
};

export const setTestUserDetails = async (
	page: Page,
	testFields: TestFields,
	internationalisationId: string,
	tier: number,
) => {
	await setTestUserPersonalDetails(
		page,
		testFields.email,
		testFields.email,
		testFields.firstName,
		testFields.lastName,
	);

	if (testFields.addresses && testFields.addresses.length > 1) {
		await page
			.getByRole('checkbox', {
				name: 'Billing address same as delivery address',
			})
			.uncheck();
	}

	if (testFields.addresses) {
		let index = 0;
		// To run in sequence using async/await, for required over forEach
		for (const address of testFields.addresses) {
			if (internationalisationId === 'US' || internationalisationId === 'AU') {
				await page
					.getByLabel('State')
					.nth(index)
					.selectOption({ label: address.state });
			}

			if (address.postCode) {
				await page
					.getByLabel(internationalisationId === 'US' ? 'ZIP code' : 'Postcode')
					// Skip UK postCode lookup component
					.nth(internationalisationId ? index : index + 1)
					.fill(address.postCode);
			}

			if (tier === 3) {
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
