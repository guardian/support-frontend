import { PayPal } from 'helpers/forms/paymentMethods';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import * as storage from 'helpers/storage/storage';
import { setPaymentMethod } from './paymentMethod/actions';
import { loadPayPalExpressSdk } from './payPal/thunks';

export function addPaymentsSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		actionCreator: setPaymentMethod,
		effect(action, listenerApi) {
			const { paymentMethod } = action.payload;
			const { payPal } = listenerApi.getState().page.checkoutForm.payment;

			storage.setSession('selectedPaymentMethod', paymentMethod);
			sendTrackingEventsOnClick({
				id: `subscriptions-payment-method-selector-${paymentMethod}`,
				componentType: 'ACQUISITIONS_OTHER',
			})();

			if (paymentMethod === PayPal && !payPal.hasBegunLoading) {
				void listenerApi.dispatch(loadPayPalExpressSdk());
			}
		},
	});
}
