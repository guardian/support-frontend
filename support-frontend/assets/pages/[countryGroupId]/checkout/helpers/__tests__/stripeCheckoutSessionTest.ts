import { storage } from '@guardian/libs';
import type { PersistableFormFields } from '../stripeCheckoutSession';
import { persistFormDetails } from '../stripeCheckoutSession';

describe('persistFormDetails', () => {
	it('should persist the form fields in session storage', () => {
		const formFields: PersistableFormFields = {
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
		};

		persistFormDetails('cs_test_abcdefghijk', formFields);

		const persistedData = storage.session.get('checkoutSessionFormData');

		expect(persistedData).toEqual({
			formDetails: formFields,
			version: 1,
			checkoutSessionId: 'cs_test_abcdefghijk',
		});
	});
});
