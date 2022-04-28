import type { AnyAction } from '@reduxjs/toolkit';
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
	setUserTypeFromIdentityResponse,
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

export function addPersonalDetailsSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		actionCreator: setFirstName,
		effect(_, listenerApi) {
			listenerApi.dispatch(
				removeErrorsForField('firstName', listenerApi.getState()),
			);
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setLastName,
		effect(_, listenerApi) {
			listenerApi.dispatch(
				removeErrorsForField('lastName', listenerApi.getState()),
			);
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setEmail,
		effect(_, listenerApi) {
			listenerApi.dispatch(
				removeErrorsForField('email', listenerApi.getState()),
			);
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setConfirmEmail,
		effect(_, listenerApi) {
			listenerApi.dispatch(
				removeErrorsForField('confirmEmail', listenerApi.getState()),
			);
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setUserTypeFromIdentityResponse,
		effect(_, listenerApi) {
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});
}
