// ----- Reducer ----- //
import type { Action } from 'helpers/subscriptionsForms/formActions';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import { removeError } from 'helpers/subscriptionsForms/validation';

function createFormReducer() {
	const initialState: FormState = {
		stage: 'checkout',
		billingAddressIsSame: true,
		formErrors: [],
		submissionError: null,
		formSubmitted: false,
		deliveryInstructions: null,
	};

	return function (state: FormState = initialState, action: Action): FormState {
		switch (action.type) {
			case 'SET_STAGE':
				return { ...state, stage: action.stage };

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
