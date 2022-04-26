import type { AnyAction } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { AnyCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { removeError } from 'helpers/subscriptionsForms/validation';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import {
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
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setFirstName,
		effect(_, listenerApi) {
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setLastName,
		effect(_, listenerApi) {
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setEmail,
		effect(action, listenerApi) {
			storage.setSession('gu.email', action.payload);
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});

	startListening({
		actionCreator: setUserTypeFromIdentityResponse,
		effect(action, listenerApi) {
			storage.setSession('userTypeFromIdentityResponse', action.payload);
			enableOrDisableForm()(
				listenerApi.dispatch,
				listenerApi.getState.bind(listenerApi),
			);
		},
	});
}
