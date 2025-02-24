// ----- Imports ----- //
import type { Dispatch } from 'redux';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { checkoutFormIsValid } from 'helpers/subscriptionsForms/formValidation';

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
	return (_dispatch: Dispatch, getState: () => SubscriptionsState): void => {
		enableOrDisablePayPalExpressCheckoutButton(checkoutFormIsValid(getState()));
	};
}

export { enableOrDisableForm };
