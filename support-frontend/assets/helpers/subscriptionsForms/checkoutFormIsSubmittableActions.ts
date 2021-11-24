// ----- Imports ----- //
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { checkoutFormIsValid } from 'helpers/subscriptionsForms/formValidation';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

// ----- Functions ----- //
const enableOrDisablePayPalExpressCheckoutButton = (
	formIsSubmittable: boolean,
) => {
	if (formIsSubmittable && window.enablePayPalButton) {
		window.enablePayPalButton();
	} else if (window.disablePayPalButton) {
		window.disablePayPalButton();
	}
};

function enableOrDisableForm() {
	return (_dispatch: Dispatch, getState: () => CheckoutState): void => {
		enableOrDisablePayPalExpressCheckoutButton(checkoutFormIsValid(getState()));
	};
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
	return (dispatch: Dispatch<Action>, getState: () => CheckoutState): void => {
		dispatch(setStateValue());
		enableOrDisableForm()(dispatch, getState);
	};
}

export {
	setFormSubmissionDependentValue,
	enableOrDisableForm,
	enableOrDisablePayPalExpressCheckoutButton,
};
