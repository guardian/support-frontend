import type { AnyAction } from '@reduxjs/toolkit';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import { enableOrDisableForm } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { AnyCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { removeError } from 'helpers/subscriptionsForms/validation';
import { setDeliveryAgent } from './actions';

function removeErrorsForField(
	fieldName: FormField,
	state: AnyCheckoutState,
): AnyAction {
	return {
		type: 'SET_FORM_ERRORS',
		errors: removeError(fieldName, state.page.checkout.formErrors),
	};
}

export function addAddressMetaSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		actionCreator: setDeliveryAgent,
		effect(_action, listenerApi) {
			listenerApi.dispatch(
				removeErrorsForField('deliveryProvider', listenerApi.getState()),
			);

			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
