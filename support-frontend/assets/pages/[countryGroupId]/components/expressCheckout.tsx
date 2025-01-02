import { css } from '@emotion/react';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import { ExpressCheckoutElement } from '@stripe/react-stripe-js';
import type {
	ExpressPaymentType,
	Stripe,
	StripeElements,
} from '@stripe/stripe-js';
import { useState } from 'react';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendEventPaymentMethodSelected } from 'helpers/tracking/quantumMetric';
import { logException } from 'helpers/utilities/logger';
import type { GeoId } from 'pages/geoIdConfig';

const countriesRequiringBillingState = ['US', 'CA', 'AU'];

type ExpressCheckoutProps = {
	setStripeExpressCheckoutPaymentType: (
		paymentType: ExpressPaymentType,
	) => void;
	stripe: Stripe | null;
	elements: StripeElements | null;
	setErrorMessage: (message: string | undefined) => void;
	setFirstName: (firstName: string) => void;
	setLastName: (lastName: string) => void;
	setBillingPostcode: (postcode: string) => void;
	setBillingState: (state: string) => void;
	setEmail: (email: string) => void;
	setPaymentMethod: (
		paymentMethod: PaymentMethod | 'StripeExpressCheckoutElement',
	) => void;
	setStripeExpressCheckoutSuccessful: (successful: boolean) => void;
	countryId: IsoCountry;
	geoId: GeoId;
	countryGroupId: CountryGroupId;
};

export default function ExpressCheckout({
	setStripeExpressCheckoutPaymentType,
	stripe,
	elements,
	setErrorMessage,
	setFirstName,
	setLastName,
	setBillingPostcode,
	setBillingState,
	setEmail,
	setPaymentMethod,
	setStripeExpressCheckoutSuccessful,
	countryId,
	geoId,
	countryGroupId,
}: ExpressCheckoutProps) {
	const [stripeExpressCheckoutReady, setStripeExpressCheckoutReady] =
		useState(false);

	return (
		<div
			css={css`
				/* Prevent content layout shift */
				min-height: 8px;
			`}
		>
			<ExpressCheckoutElement
				onReady={({ availablePaymentMethods }) => {
					/**
					 * This is use to show UI needed besides this Element
					 * i.e. The "or" divider
					 */
					if (availablePaymentMethods) {
						setStripeExpressCheckoutReady(true);
					}
				}}
				onClick={({ resolve }) => {
					/** @see https://docs.stripe.com/elements/express-checkout-element/accept-a-payment?locale=en-GB#handle-click-event */
					const options = {
						emailRequired: true,
					};

					// Track payment method selection with QM
					sendEventPaymentMethodSelected('StripeExpressCheckoutElement');

					resolve(options);
				}}
				onConfirm={async (event) => {
					if (!(stripe && elements)) {
						console.error('Stripe not loaded');
						return;
					}

					const { error: submitError } = await elements.submit();

					if (submitError) {
						setErrorMessage(submitError.message);
						return;
					}

					const name = event.billingDetails?.name ?? '';

					/**
					 * splits by the last space, and uses the head as firstName
					 * and tail as lastName
					 */
					const firstName = name.substring(0, name.lastIndexOf(' ') + 1).trim();
					const lastName = name
						.substring(name.lastIndexOf(' ') + 1, name.length)
						.trim();
					setFirstName(firstName);
					setLastName(lastName);

					event.billingDetails?.address.postal_code &&
						setBillingPostcode(event.billingDetails.address.postal_code);

					if (
						!event.billingDetails?.address.state &&
						countriesRequiringBillingState.includes(countryId)
					) {
						logException("Could not find state from Stripe's billingDetails", {
							geoId,
							countryGroupId,
							countryId,
						});
					}
					event.billingDetails?.address.state &&
						setBillingState(event.billingDetails.address.state);

					event.billingDetails?.email && setEmail(event.billingDetails.email);

					setPaymentMethod('StripeExpressCheckoutElement');
					setStripeExpressCheckoutPaymentType(event.expressPaymentType);
					/**
					 * There is a useEffect that listens to this and submits the form
					 * when true
					 */
					setStripeExpressCheckoutSuccessful(true);
				}}
				options={{
					paymentMethods: {
						applePay: 'auto',
						googlePay: 'auto',
						link: 'auto',
					},
				}}
			/>

			{stripeExpressCheckoutReady && (
				<Divider
					displayText="or"
					size="full"
					cssOverrides={css`
						::before {
							margin-left: 0;
						}

						::after {
							margin-right: 0;
						}

						margin: 0;
						margin-top: 14px;
						margin-bottom: 14px;
						width: 100%;

						@keyframes fadeIn {
							0% {
								opacity: 0;
							}
							100% {
								opacity: 1;
							}
						}
						animation: fadeIn 1s;
					`}
				/>
			)}
		</div>
	);
}
