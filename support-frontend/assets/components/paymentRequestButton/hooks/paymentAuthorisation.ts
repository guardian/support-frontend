import type { PaymentMethod, Stripe as StripeJs } from '@stripe/stripe-js';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/forms/paymentMethods';
import type {
	StripeAccount,
	StripePaymentIntentResult,
} from 'helpers/forms/stripe';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { setPaymentRequestError } from 'helpers/redux/checkout/payment/paymentRequestButton/actions';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { trackComponentEvents } from 'helpers/tracking/ophan';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
} from 'pages/contributions-landing/contributionsLandingActions';

export async function fetchClientSecret(
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

export function onPaymentAuthorised(
	stripe: StripeJs,
	paymentMethod: PaymentMethod,
	internalPaymentMethodName: StripePaymentMethod,
): ReturnType<typeof onThirdPartyPaymentAuthorised> {
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

export function createPaymentRequestErrorHandler(
	dispatch: ContributionsDispatch,
	account: StripeAccount,
): (error: ErrorReason) => void {
	return function paymentRequestErrorHandler(error: ErrorReason) {
		dispatch(
			setPaymentRequestError({
				error,
				account,
			}),
		);
		dispatch(paymentWaiting(false));
	};
}
