import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { setPaymentMethod } from './paymentMethod/actions';

export function addPaymentsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setPaymentMethod,
		effect(action) {
			storage.setSession('selectedPaymentMethod', action.payload.paymentMethod);
		},
	});
}
