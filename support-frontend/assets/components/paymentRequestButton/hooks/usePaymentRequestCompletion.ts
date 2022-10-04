import type {
	PaymentMethod,
	PaymentRequest,
	Stripe as StripeJs,
} from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/forms/paymentMethods';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { trackComponentEvents } from 'helpers/tracking/ophan';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
} from 'pages/contributions-landing/contributionsLandingActions';
import {
	setBillingCountryAndState,
	setPayerEmail,
	setPayerName,
} from './utils';

export function usePaymentRequestCompletion(
	stripe: StripeJs | null,
	paymentRequest: PaymentRequest | null,
	internalPaymentMethodName: StripePaymentMethod | null,
): void {
	const [paymentAuthorised, setPaymentAuthorised] = useState<boolean>(false);
	const [paymentWallet, setPaymentWallet] = useState<string>('');
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
		null,
	);

	const dispatch = useContributionsDispatch();

	useEffect(() => {
		if (paymentRequest) {
			paymentRequest.on('paymentmethod', (paymentMethodEvent) => {
				const { complete, paymentMethod, payerName, payerEmail, walletName } =
					paymentMethodEvent;

				// Always dismiss the payment popup immediately - any pending/success/failure will be displayed on our own page.
				// This is because `complete` must be called within 30 seconds or the user will see an error.
				// Our backend (support-workers) can in extreme cases take longer than this, so we must call complete now.
				// This means that the browser's payment popup will be dismissed, and our own 'spinner' will be displayed until
				// the backend job finishes.
				complete('success');

				setPaymentMethod(paymentMethod);
				setPaymentWallet(walletName);
				setPayerName(dispatch, payerName);
				setPayerEmail(dispatch, payerEmail);
				setBillingCountryAndState(dispatch, paymentMethod.billing_details);

				setPaymentAuthorised(true);

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
		if (
			stripe &&
			paymentAuthorised &&
			paymentMethod &&
			internalPaymentMethodName
		) {
			// TODO: HANDLE VALIDATION IN HERE!!
			trackComponentClick(`${paymentWallet}-paymentAuthorised`);

			dispatch(paymentWaiting(true));

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

			void dispatch(
				onThirdPartyPaymentAuthorised({
					paymentMethod: Stripe,
					paymentMethodId: paymentMethod.id,
					stripePaymentMethod: internalPaymentMethodName,
					handle3DS: (clientSecret: string) => {
						trackComponentLoad('stripe-3ds');
						return stripe.handleCardAction(clientSecret);
					},
				}),
			);
		}
	}, [paymentAuthorised]);
}
