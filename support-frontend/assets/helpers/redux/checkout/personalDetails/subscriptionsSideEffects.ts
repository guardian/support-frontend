import type { AnyAction } from '@reduxjs/toolkit';
import { isAnyOf } from '@reduxjs/toolkit';
import {
	setEmail as setEmailGift,
	setFirstName as setFirstNameGift,
	setGiftDeliveryDate,
	setLastName as setLastNameGift,
} from 'helpers/redux/checkout/giftingState/actions';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import { enableOrDisableForm } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { AnyCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { removeError } from 'helpers/subscriptionsForms/validation';
import {
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
} from './actions';

export function removeErrorsForField(
	fieldName: FormField,
	state: AnyCheckoutState,
): AnyAction {
	return {
		type: 'SET_FORM_ERRORS',
		errors: removeError(fieldName, state.page.checkout.formErrors),
	};
}

const shouldCheckFormEnabled = isAnyOf(
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setFirstNameGift,
	setLastNameGift,
	setEmailGift,
	setGiftDeliveryDate,
);

export function addPersonalDetailsSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(_, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
