// ----- Imports ----- //
import type { Dispatch } from 'redux';
import type { SubscriptionsDispatch } from 'helpers/redux/subscriptionsStore';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { checkoutFormIsValid } from 'helpers/subscriptionsForms/formValidation';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

// ----- Functions ----- //
function enableOrDisablePayPalExpressCheckoutButton(
	formIsSubmittable: boolean,
): void {
	if (formIsSubmittable && window.enablePayPalButton) {
		window.enablePayPalButton();
	} else if (window.disablePayPalButton) {
		window.disablePayPalButton();
	}
}

function enableOrDisableForm() {
	return (_dispatch: Dispatch, getState: () => CheckoutState): void => {
		enableOrDisablePayPalExpressCheckoutButton(checkoutFormIsValid(getState()));
	};
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
	return (
		dispatch: SubscriptionsDispatch,
		getState: () => CheckoutState,
	): void => {
		dispatch(setStateValue());
		enableOrDisableForm()(dispatch, getState);
	};
}

export type FormSubmissionDependentValueThunk = ReturnType<
	typeof setFormSubmissionDependentValue
>;

export {
	setFormSubmissionDependentValue,
	enableOrDisableForm,
	enableOrDisablePayPalExpressCheckoutButton,
};
