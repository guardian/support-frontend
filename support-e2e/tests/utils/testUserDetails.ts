import { Page } from '@playwright/test';
import { TestFields } from './userFields';

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

const requireAddress = (
	product: string,
	internationalisationId: string,
): boolean => {
	switch (product) {
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
		case 'TierThree':
			return true; // global
		case 'HomeDelivery':
		case 'NationalDelivery':
		case 'SubscriptionCard':
			if (internationalisationId !== 'UK') {
				throw new Error(
					`${product} is only available in the UK, but got ${internationalisationId}`,
				);
			}
			return true; // UK specific
		default:
			return false;
	}
};

export const setTestUserCoreDetails = async (
	page: Page,
	email: string,
	firstName?: string,
	lastName?: string,
	confirmEmail?: boolean,
) => {
	await page.getByLabel('Email address', { exact: true }).fill(email);
	if (confirmEmail) {
		await page.getByLabel('Confirm email address', { exact: true }).fill(email);
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
	product: string,
	internationalisationId: string,
	testFields: TestFields,
) => {
	const stateLabel = internationalisationId === 'CA' ? 'Province' : 'State';
	await setTestUserCoreDetails(
		page,
		testFields.email,
		testFields.firstName,
		testFields.lastName,
		true, // confirmEmail required
	);
	if (['US', 'AU', 'CA'].includes(internationalisationId)) {
		await page
			.getByLabel(stateLabel)
			.selectOption({ label: testFields.addresses[0].state });
	}

	if (requireAddress(product, internationalisationId) && testFields.addresses) {
		if (testFields.addresses.length > 1) {
			await page
				.getByRole('checkbox', {
					name: 'Billing address same as delivery address',
				})
				.uncheck();
		}

		// To run in sequence using async/await, for required over forEach
		let index = 0;
		const postcodeLabel =
			internationalisationId === 'US' ? 'ZIP code' : 'Postcode';
		for (const address of testFields.addresses) {
			if (address.state) {
				await page
					.getByLabel(stateLabel)
					.nth(index)
					.selectOption({ label: address.state });
			}
			if (address.postCode) {
				await page
					.getByLabel(postcodeLabel)
					// UK postCodes have extra lookup, doubling its location on screen
					.nth(internationalisationId === 'UK' ? index * 2 : index)
					.fill(address.postCode);
			}
			if (address.firstLine) {
				await page
					.getByLabel(`Address Line 1`)
					.nth(index)
					.fill(address.firstLine ?? '');
			}
			if (address.city) {
				await page
					.getByLabel(`Town/City`)
					.nth(index)
					.fill(address.city ?? '');
			}
			index++;
		}
		if (product === 'NationalDelivery') {
			await selectDeliveryAgent(page);
		}
	}
};
