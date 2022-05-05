import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import {
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
} from './actions';

const shouldCheckFormEnabled = isAnyOf(
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
);

export function addPersonalDetailsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(action, listenerApi) {
			if (setUserTypeFromIdentityResponse.match(action)) {
				storage.setSession('userTypeFromIdentityResponse', action.payload);
			} else if (setEmail.match(action)) {
				storage.setSession('gu.email', action.payload);
			}
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
