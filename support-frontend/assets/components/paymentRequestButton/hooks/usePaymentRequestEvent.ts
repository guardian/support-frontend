import type { PaymentMethod, PaymentRequest } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import {
	completePaymentRequest,
	unClickPaymentRequestButton,
} from 'helpers/redux/checkout/payment/paymentRequestButton/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentEvents } from 'helpers/tracking/ophan';
import { addPayerDetailsToRedux } from './payerDetails';

export type PaymentEventDetails = {
	paymentMethod: PaymentMethod | null;
	paymentWallet: string;
};

// Handles listening for the payment event from Stripe, and returns details from that payment event
export function usePaymentRequestEvent(
	paymentRequest: PaymentRequest | null,
): PaymentEventDetails {
	const [paymentWallet, setPaymentWallet] = useState<string>('');
	const [paymentMethod, setStripePaymentMethod] =
		useState<PaymentMethod | null>(null);

	const { stripeAccount } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);
	const dispatch = useContributionsDispatch();

	useEffect(() => {
		if (paymentRequest) {
			paymentRequest.on('paymentmethod', (paymentMethodEvent) => {
				const { paymentMethod, walletName } = paymentMethodEvent;

				// Always dismiss the payment popup immediately - any pending/success/failure will be displayed on our own page.
				// This is because `complete` must be called within 30 seconds or the user will see an error.
				// Our backend (support-workers) can in extreme cases take longer than this, so we must call complete now.
				// This means that the browser's payment popup will be dismissed, and our own 'spinner' will be displayed until
				// the backend job finishes.
				paymentMethodEvent.complete('success');

				addPayerDetailsToRedux(dispatch, paymentMethodEvent);
				setStripePaymentMethod(paymentMethod);
				setPaymentWallet(walletName);
				dispatch(validateForm());
				dispatch(completePaymentRequest(stripeAccount));

				const walletType =
					(paymentMethod.card?.wallet?.type as string | null) ?? 'no-wallet';

				trackComponentEvents({
					component: {
						componentType: 'ACQUISITIONS_OTHER',
					},
					action: 'CLICK',
					id: 'stripe-prb-wallet',
					value: walletType,
				});
			});
		}
	}, [paymentRequest]);

	useEffect(() => {
		if (paymentRequest) {
			paymentRequest.on('cancel', () => {
				// It's possible to receive the 'cancel' event when the user has actually authorised a payment, so
				// only proceed if we don't yet have a PaymentMethod object
				// cf. https://stripe.com/docs/js/payment_request/events/on_cancel
				if (!paymentMethod) {
					dispatch(unClickPaymentRequestButton(stripeAccount));
					dispatch(setPaymentMethod('None'));
				}
			});
		}
	}, [paymentRequest]);

	return {
		paymentMethod,
		paymentWallet,
	};
}
