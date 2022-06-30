// ----- Imports ----- //

import {
	setFormErrors,
	setStage,
} from 'helpers/subscriptionsForms/formActions';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormField, Stage } from '../formFields';
import type { FormError } from '../validation';

jest.mock('ophan', () => () => ({}));

// ----- Tests ----- //

describe('Subscription Checkout Reducer', () => {
	it('should handle SET_STAGE to "thankyou"', () => {
		const stage: Stage = 'thankyou';
		const action = setStage(stage, 'DigitalPack', undefined);

		const newState = createReducer(null)(undefined, action);

		expect(newState.checkout.stage).toEqual(stage);
	});

	it('should handle SET_STAGE to "checkout"', () => {
		const stage: Stage = 'checkout';
		const action = setStage(stage, 'DigitalPack', undefined);

		const newState = createReducer(null)(undefined, action);

		expect(newState.checkout.stage).toEqual(stage);
	});

	it('should setErrors on the redux store', () => {
		const errors = [
			{
				field: 'addressLine1',
				message: 'Please enter a value',
			},
			{
				field: 'townCity',
				message: 'Please enter a value',
			},
			{
				field: 'postcode',
				message: 'Please enter a value',
			},
		];
		const action = setFormErrors(errors as Array<FormError<FormField>>);

		const newState = createReducer(null)(undefined, action);

		expect(newState.checkout.formErrors).toEqual(errors);
	});
});
