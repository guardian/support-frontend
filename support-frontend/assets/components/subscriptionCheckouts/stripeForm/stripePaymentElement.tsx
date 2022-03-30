import { ThemeProvider } from '@emotion/react';
import {
	Button,
	buttonThemeReaderRevenue,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import {
	Elements,
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { StripePaymentIntentResult } from 'helpers/forms/stripe';
import { getStripeKey } from 'helpers/forms/stripe';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';

export type PropTypes = {
	country: IsoCountry;
	isTestUser: boolean;
	submitForm: () => void;
	validateForm: () => void;
	buttonText: string;
	csrf: Csrf;
};

function Payment(props: { buttonText: string }) {
	const stripe = useStripe();
	const elements = useElements();
	const [disableButton, setDisableButton] = useState(false);

	async function submitPayment() {
		if (stripe && elements) {
			try {
				setDisableButton(true);
				const stripeResult = await stripe.confirmPayment({
					elements,
					confirmParams: {
						return_url: window.location.toString(),
					},
					redirect: 'if_required',
				});
				setDisableButton(false);
				console.log(stripeResult);
			} catch (error) {
				setDisableButton(false);
				logException(
					`Error making Stripe payment: ${(error as Error).message}`,
				);
			}
		}
	}

	return (
		<>
			<PaymentElement />
			<div className="component-stripe-submit-button">
				<ThemeProvider theme={buttonThemeReaderRevenue}>
					<Button
						id="qa-stripe-submit-button"
						onClick={submitPayment}
						priority="primary"
						icon={<SvgArrowRightStraight />}
						iconSide="right"
						disabled={disableButton}
					>
						{props.buttonText}
					</Button>
				</ThemeProvider>
			</div>
		</>
	);
}

export function StripePaymentElement(props: PropTypes): JSX.Element {
	const [stripeObject, setStripeObject] = useState<stripeJs.Stripe | null>(
		null,
	);
	const [clientSecret, setClientSecret] = useState('');
	const stripeKey = getStripeKey('REGULAR', props.country, props.isTestUser);

	async function fetchClientSecret() {
		try {
			const result: StripePaymentIntentResult = await fetchJson(
				routes.stripeSetupIntentRecaptcha,
				requestOptions(
					{
						token: 'dummy',
						stripePublicKey: stripeKey,
						isTestUser: props.isTestUser,
					},
					'same-origin',
					'POST',
					props.csrf,
				),
			);

			if (result.client_secret) {
				setClientSecret(result.client_secret);
			} else {
				throw new Error(
					`Missing client_secret field in response from ${routes.stripeSetupIntentRecaptcha}`,
				);
			}
		} catch (error) {
			logException(
				`Error getting Stripe client secret for subscription: ${
					(error as Error).message
				}`,
			);
		}
	}

	useEffect(() => {
		void fetchClientSecret();
		if (stripeObject === null) {
			void stripeJs.loadStripe(stripeKey).then(setStripeObject);
		}
	}, []);

	return (
		<>
			{clientSecret && (
				<Elements stripe={stripeObject} options={{ clientSecret }}>
					<Payment buttonText={props.buttonText} />
				</Elements>
			)}
		</>
	);
}
