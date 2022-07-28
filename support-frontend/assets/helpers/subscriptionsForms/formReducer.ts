// ----- Reducer ----- //
import type { Action } from 'helpers/subscriptionsForms/formActions';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import { removeError } from 'helpers/subscriptionsForms/validation';
import { isTestUser } from 'helpers/user/user';

function createFormReducer() {
	const initialState: FormState = {
		stage: 'checkout',
		billingAddressIsSame: true,
		paymentMethod: null,
		formErrors: [],
		submissionError: null,
		formSubmitted: false,
		isTestUser: isTestUser(),
		stripePaymentMethod: null,
		deliveryInstructions: null,
		debugInfo: '',
	};

	return function (
		originalState: FormState = initialState,
		action: Action,
	): FormState {
		const state = {
			...originalState,
			debugInfo: `${originalState.debugInfo} ${JSON.stringify(action)}\n`,
		};

		switch (action.type) {
			case 'SET_STAGE':
				return { ...state, stage: action.stage };

			case 'ON_DELIVERY_COUNTRY_CHANGED':
				// For the payment reducer(s), we can use an extraReducer with the setDeliveryCountry action for this
				return {
					...state,
					paymentMethod: null,
				};

			case 'SET_FORM_ERRORS':
				return { ...state, formErrors: action.errors };

			case 'SET_SUBMISSION_ERROR':
				return {
					...state,
					submissionError: action.error,
					formSubmitted: false,
				};

			case 'SET_FORM_SUBMITTED':
				return { ...state, formSubmitted: action.formSubmitted };

			case 'SET_BILLING_ADDRESS_IS_SAME':
				return {
					...state,
					billingAddressIsSame: action.isSame,
					formErrors: removeError('billingAddressIsSame', state.formErrors),
				};

			case 'SET_STRIPE_PAYMENT_METHOD':
				return { ...state, stripePaymentMethod: action.stripePaymentMethod };

			case 'SET_DELIVERY_INSTRUCTIONS':
				return { ...state, deliveryInstructions: action.instructions };

			case 'SET_CSR_USERNAME':
				return {
					...state,
					csrUsername: action.username,
				};

			case 'SET_SALESFORCE_CASE_ID':
				return {
					...state,
					salesforceCaseId: action.caseId,
				};

			default:
				return state;
		}
	};
}

export { createFormReducer };
