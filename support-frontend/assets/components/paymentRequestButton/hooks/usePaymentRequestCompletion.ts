import type { PaymentMethod, Stripe as StripeJs } from '@stripe/stripe-js';
import { useContext, useEffect } from 'react';
import { StripeAccountContext } from 'components/stripe/stripeAccountContext';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { StripePaymentIntentResult } from 'helpers/forms/stripe';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { trackComponentEvents } from 'helpers/tracking/ophan';
import { logException } from 'helpers/utilities/logger';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { PaymentEventDetails } from './usePaymentRequestListener';
import { createPaymentRequestErrorHandler } from './utils';

async function fetchClientSecret(
	stripePublicKey: string,
	csrf: CsrfState,
): Promise<string> {
	const setupIntentResult: StripePaymentIntentResult = await fetchJson(
		'/stripe/create-setup-intent/prb',
		requestOptions(
			{
				stripePublicKey,
			},
			'omit',
			'POST',
			csrf,
		),
	);
	if (setupIntentResult.client_secret) {
		return setupIntentResult.client_secret;
	}
	throw new Error('Missing client_secret field in response for PRB');
}

function handlePayment(
	stripe: StripeJs,
	paymentMethod: PaymentMethod,
	internalPaymentMethodName: StripePaymentMethod,
) {
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

	return onThirdPartyPaymentAuthorised({
		paymentMethod: Stripe,
		paymentMethodId: paymentMethod.id,
		stripePaymentMethod: internalPaymentMethodName,
		handle3DS: (clientSecret: string) => {
			trackComponentLoad('stripe-3ds');
			return stripe.handleCardAction(clientSecret);
		},
	});
}

// Deals with our custom payment handling and checkout completion following
// the user's successful interaction with the payment request interface
export function usePaymentRequestCompletion(
	stripe: StripeJs | null,
	internalPaymentMethodName: StripePaymentMethod | null,
	{ paymentMethod, paymentAuthorised, paymentWallet }: PaymentEventDetails,
): void {
	const { publicKey, stripeAccount } = useContext(StripeAccountContext);
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);

	const dispatch = useContributionsDispatch();

	const errorHandler = createPaymentRequestErrorHandler(
		dispatch,
		stripeAccount,
	);

	useEffect(() => {
		if (
			paymentAuthorised &&
			stripe &&
			paymentMethod &&
			internalPaymentMethodName
		) {
			// TODO: HANDLE VALIDATION IN HERE!!
			trackComponentClick(`${paymentWallet}-paymentAuthorised`);

			dispatch(paymentWaiting(true));

			if (stripeAccount === 'REGULAR') {
				fetchClientSecret(publicKey, csrf)
					.then((clientSecret) =>
						stripe.confirmCardSetup(clientSecret, {
							payment_method: paymentMethod.id,
						}),
					)
					.then((result) => {
						if (result.error) {
							errorHandler('card_authentication_error');
						} else {
							return dispatch(
								handlePayment(stripe, paymentMethod, internalPaymentMethodName),
							);
						}
					})
					.catch((error: Error) => {
						logException(
							`Error confirming recurring contribution from Payment Request Button: - message: ${error.message}`,
						);
						errorHandler('internal_error');
					});
			} else {
				void dispatch(
					handlePayment(stripe, paymentMethod, internalPaymentMethodName),
				);
			}
		}
	}, [paymentAuthorised]);
}
