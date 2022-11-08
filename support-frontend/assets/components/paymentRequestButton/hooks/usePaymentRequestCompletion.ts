import type { Stripe as StripeJs } from '@stripe/stripe-js';
import { useEffect } from 'react';
import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import { paymentWaiting } from 'pages/contributions-landing/contributionsLandingActions';
import { resetPayerDetails } from './payerDetails';
import {
	createPaymentRequestErrorHandler,
	fetchClientSecret,
	onPaymentAuthorised,
} from './paymentAuthorisation';
import type { PaymentEventDetails } from './usePaymentRequestEvent';

// Deals with our custom payment handling and checkout completion following
// the user's successful interaction with the payment request interface
export function usePaymentRequestCompletion(
	stripe: StripeJs | null,
	internalPaymentMethodName: StripePaymentMethod | null,
	{ paymentMethod, paymentWallet }: PaymentEventDetails,
): void {
	const { publicKey, stripeAccount } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	const dispatch = useContributionsDispatch();

	const errorHandler = createPaymentRequestErrorHandler(
		dispatch,
		stripeAccount,
	);

	useEffect(() => {
		if (errorsPreventSubmission) {
			dispatch(setPaymentMethod('None'));
			resetPayerDetails(dispatch);
			errorHandler('incomplete_payment_request_details');
			return;
		}
		if (stripe && paymentMethod && internalPaymentMethodName) {
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
								onPaymentAuthorised(
									stripe,
									paymentMethod,
									internalPaymentMethodName,
								),
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
					onPaymentAuthorised(stripe, paymentMethod, internalPaymentMethodName),
				);
			}
		}
	}, [paymentMethod]);
}
