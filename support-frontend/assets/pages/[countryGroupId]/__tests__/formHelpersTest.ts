import {
	extractDeliverableAddressDataFromForm,
	extractNonDeliverableAddressDataFromForm,
	extractPersonalDataFromForm,
} from '../checkout/helpers/formDataExtractors';

describe('extractPersonalDataFromForm', () => {
	it('extracts personal data from the form and returns it as an object', () => {
		const formData = new FormData();
		formData.append('firstName', 'Bill');
		formData.append('lastName', 'Murray');
		formData.append('email', 'bill@example.com');

		const personalData = extractPersonalDataFromForm(formData);

		expect(personalData).toEqual({
			firstName: 'Bill',
			lastName: 'Murray',
			email: 'bill@example.com',
		});
	});
});

describe('extractDeliverableAddressDataFromForm', () => {
	it('extracts distinct delivery and billing address data when they are different', () => {
		const formData = new FormData();
		formData.append('billing-lineOne', 'The Guardian');
		formData.append('billing-lineTwo', '1 Main Street');
		formData.append('billing-city', 'London');
		formData.append('billing-stateProvince', 'London');
		formData.append('billing-postcode', 'N91GU');
		formData.append('billing-country', 'UK');
		formData.append('billingAddressMatchesDelivery', 'no');
		formData.append('delivery-lineOne', 'Somewhere else');
		formData.append('delivery-lineTwo', 'The Avenue');
		formData.append('delivery-city', 'Manchester');
		formData.append('delivery-stateProvince', 'Manchester');
		formData.append('delivery-postcode', 'MU123');
		formData.append('delivery-country', 'UK');

		const { deliveryAddress, billingAddress } =
			extractDeliverableAddressDataFromForm(formData);

		expect(billingAddress).toEqual({
			lineOne: 'The Guardian',
			lineTwo: '1 Main Street',
			city: 'London',
			state: 'London',
			postCode: 'N91GU',
			country: 'UK',
		});
		expect(deliveryAddress).toEqual({
			lineOne: 'Somewhere else',
			lineTwo: 'The Avenue',
			city: 'Manchester',
			state: 'Manchester',
			postCode: 'MU123',
			country: 'UK',
		});
	});

	it('uses the delivery address as the billing address when they are the same', () => {
		const formData = new FormData();
		formData.append('delivery-lineOne', 'The Guardian');
		formData.append('delivery-lineTwo', '1 Main Street');
		formData.append('delivery-city', 'London');
		formData.append('delivery-stateProvince', 'London');
		formData.append('delivery-postcode', 'N91GU');
		formData.append('delivery-country', 'UK');
		formData.append('billingAddressMatchesDelivery', 'yes');

		const { deliveryAddress, billingAddress } =
			extractDeliverableAddressDataFromForm(formData);

		expect(billingAddress).toEqual({
			lineOne: 'The Guardian',
			lineTwo: '1 Main Street',
			city: 'London',
			state: 'London',
			postCode: 'N91GU',
			country: 'UK',
		});
		expect(deliveryAddress).toEqual({
			lineOne: 'The Guardian',
			lineTwo: '1 Main Street',
			city: 'London',
			state: 'London',
			postCode: 'N91GU',
			country: 'UK',
		});
	});
});

describe('extractNonDeliverableAddressDataFromForm', () => {
	it('uses the delivery address as the billing address when they are the same', () => {
		const formData = new FormData();
		formData.append('billing-state', 'London');
		formData.append('billing-postcode', 'N91GU');
		formData.append('billing-country', 'UK');

		const { deliveryAddress, billingAddress } =
			extractNonDeliverableAddressDataFromForm(formData);

		expect(billingAddress).toEqual({
			state: 'London',
			postCode: 'N91GU',
			country: 'UK',
		});
		expect(deliveryAddress).toBeUndefined();
	});
});
