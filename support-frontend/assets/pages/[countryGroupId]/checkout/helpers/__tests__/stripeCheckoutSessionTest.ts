import { storage } from '@guardian/libs';
import type { PersistableFormFields } from '../stripeCheckoutSession';
import { getFormDetails, persistFormDetails } from '../stripeCheckoutSession';

const buildData = (): PersistableFormFields => {
	return {
		personalData: {
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane.doe@example.com',
		},
		addressFields: {
			billingAddress: {
				lineOne: '123 Main St',
				lineTwo: 'Apt 1',
				city: 'Anytown',
				state: 'Example',
				postCode: 'N1',
				country: 'GB',
			},
			deliveryAddress: {
				lineOne: '123 Main St',
				lineTwo: 'Apt 1',
				city: 'Anytown',
				state: 'Example',
				postCode: 'N1',
				country: 'GB',
			},
		},
		deliveryInstructions: 'Side entrance, please',
	};
};

describe('persistFormDetails', () => {
	it('should persist the form fields in session storage', () => {
		const formFields = buildData();

		persistFormDetails('cs_test_abcdefghijk', formFields);

		const persistedData = storage.session.get('checkoutSessionFormData');
		expect(persistedData).toEqual({
			formDetails: formFields,
			version: 1,
			checkoutSessionId: 'cs_test_abcdefghijk',
		});
	});
});

describe('getFormDetails', () => {
	it('returns the data', () => {
		const formFields = buildData();
		const checkoutSessionId = 'cs_test_abcdefghijk';
		persistFormDetails(checkoutSessionId, formFields);

		const persistedData = getFormDetails(checkoutSessionId);

		expect(persistedData).toEqual(formFields);
	});

	it('returns undefined if the data is not valid according to the schema', () => {
		storage.session.set('checkoutSessionFormData', { bad: 'data' });

		const persistedData = getFormDetails('cs_test_abcdefghijk');

		expect(persistedData).toBeUndefined();
	});

	it('returns undefined if the checkoutSessionId in the does not match the one specified', () => {
		persistFormDetails('cs_test_abcdefghijk', buildData());

		const persistedData = getFormDetails('cs_test_different_id');

		expect(persistedData).toBeUndefined();
	});
});
