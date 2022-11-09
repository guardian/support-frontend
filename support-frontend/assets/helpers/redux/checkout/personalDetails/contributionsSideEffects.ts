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
import { getUserTypeFromIdentity } from './thunks';

const shouldCheckFormEnabled = isAnyOf(
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
	getUserTypeFromIdentity.fulfilled,
);

const isSettingUserType = isAnyOf(
	setUserTypeFromIdentityResponse,
	getUserTypeFromIdentity.fulfilled,
);

export function addPersonalDetailsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(action, listenerApi) {
			if (isSettingUserType(action)) {
				storage.setSession('userTypeFromIdentityResponse', action.payload);
			} else if (setEmail.match(action)) {
				storage.setSession('gu.email', action.payload);
			}
			listenerApi.dispatch(enableOrDisableForm());
		},
	});

	startListening({
		actionCreator: setEmail,
		effect(action, listenerApi) {
			void listenerApi.dispatch(getUserTypeFromIdentity(action.payload));
		},
	});
}
