import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { setPopupOpen } from './directDebit/actions';

export function addPaymentsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setPopupOpen,
		effect() {
			// TODO: we should do this on the payment method selection action instead in future
			storage.setSession('selectedPaymentMethod', DirectDebit);
		},
	});
}
