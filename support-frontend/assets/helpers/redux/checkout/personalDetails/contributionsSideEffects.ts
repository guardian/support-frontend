import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { setEmail, setFirstName, setLastName } from './actions';

const shouldCheckFormEnabled = isAnyOf(setEmail, setFirstName, setLastName);

export function addPersonalDetailsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(action) {
			if (setEmail.match(action)) {
				storage.setSession('gu.email', action.payload);
			}
		},
	});
}
