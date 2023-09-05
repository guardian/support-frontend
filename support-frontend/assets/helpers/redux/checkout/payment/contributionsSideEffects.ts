import {
	setBillingCountry,
	setBillingState,
} from 'helpers/redux/checkout/address/actions';
import {
	setPaymentMethod,
	setPaymentMethodCountryAndState,
} from 'helpers/redux/checkout/payment/paymentMethod/actions';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';

export function addPaymentsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setPaymentMethod,
		effect(action) {
			storage.setSession('selectedPaymentMethod', action.payload.paymentMethod);
		},
	});

	startListening({
		actionCreator: setPaymentMethodCountryAndState,
		effect(action, listenerApi) {
			listenerApi.dispatch(setBillingCountry(action.payload[0]));
			action.payload[1] &&
				listenerApi.dispatch(setBillingState(action.payload[1]));
		},
	});
}
