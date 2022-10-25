import {
	CardNumberElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { StripeError } from '@stripe/stripe-js';
import { useEffect, useState } from 'preact/hooks';
import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { Stripe } from 'helpers/forms/paymentMethods';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import {
	onThirdPartyPaymentAuthorised,
	paymentFailure,
	paymentWaiting,
} from 'pages/contributions-landing/contributionsLandingActions';

export function StripePaymentButton(): JSX.Element {
	const [paymentAwaitingSetupIntent, setPaymentAwaitingSetupIntent] =
		useState(false);

	const stripe = useStripe();
	const elements = useElements();
	const dispatch = useContributionsDispatch();

	const { postCode } = useContributionsSelector(
		(state) => state.page.checkoutForm.billingAddress.fields,
	);
	const { stripeAccount } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);
	const { setupIntentClientSecret } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripe,
	);

	const payWithStripe = useFormValidation(function pay() {
		if (stripeAccount === 'ONE_OFF') {
			oneOffPayment();
		} else if (setupIntentClientSecret) {
			recurringPayment(setupIntentClientSecret);
		} else {
			// The setupIntentClientSecret is requested asynchronously when the user completes the recaptcha and is
			// required to establish our intent to take future card payments.
			// Thus it's possible that the user clicks the payment button *before* we have this secret available.
			// In this case we record that they *intend* to pay, and then attempt to make the payment via the useEffect hook below
			// which will run when the client secret has become available
			setPaymentAwaitingSetupIntent(true);
		}
	});

	function handleStripeError(errorData: StripeError): void {
		dispatch(paymentWaiting(false));
		logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);

		if (errorData.type === 'validation_error') {
			// This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
			// happen then display a generic error about card details
			dispatch(paymentFailure('payment_details_incorrect'));
		} else {
			// This is probably a Stripe or network problem
			dispatch(paymentFailure('payment_provider_unavailable'));
		}
	}

	function oneOffPayment() {
		const cardElement = elements?.getElement(CardNumberElement);

		if (stripe && cardElement) {
			const handle3DS = (clientSecret: string) => {
				trackComponentLoad('stripe-3ds');
				return stripe.handleCardAction(clientSecret);
			};

			void stripe
				.createPaymentMethod({
					type: 'card',
					card: cardElement,
					billing_details: {
						address: {
							postal_code: postCode ?? '',
						},
					},
				})
				.then((result) => {
					if (result.error) {
						handleStripeError(result.error);
					} else {
						void dispatch(
							onThirdPartyPaymentAuthorised({
								paymentMethod: Stripe,
								stripePaymentMethod: 'StripeCheckout',
								paymentMethodId: result.paymentMethod.id,
								handle3DS,
							}),
						);
					}
				});
		}
	}

	function recurringPayment(clientSecret: string): void {
		const cardElement = elements?.getElement(CardNumberElement);

		if (stripe && cardElement) {
			void stripe
				.confirmCardSetup(clientSecret, {
					payment_method: {
						card: cardElement,
						billing_details: {
							address: {
								postal_code: postCode ?? '',
							},
						},
					},
				})
				.then((result) => {
					if (result.error) {
						handleStripeError(result.error);
					} else if (result.setupIntent.payment_method) {
						void dispatch(
							onThirdPartyPaymentAuthorised({
								paymentMethod: Stripe,
								stripePaymentMethod: 'StripeCheckout',
								paymentMethodId: result.setupIntent.payment_method,
							}),
						);
					}
				});
		}
	}

	useEffect(() => {
		if (setupIntentClientSecret && paymentAwaitingSetupIntent) {
			recurringPayment(setupIntentClientSecret);
		}
	}, [setupIntentClientSecret, paymentAwaitingSetupIntent]);

	return <DefaultPaymentButtonContainer onClick={payWithStripe} />;
}
