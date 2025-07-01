import type { IsoCountry } from '@modules/internationalisation/country';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { Elements } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { getStripeKeyForCountry } from 'helpers/forms/stripe';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';

// Types
export type PropTypes = {
	country: IsoCountry;
	currency: IsoCurrency;
	isTestUser: boolean;
	allErrors: Array<FormError<FormField>>;
	submitForm: () => void;
	validateForm: () => void;
	buttonText: string;
	csrf: CsrfState;
	setStripePublicKey: (payload: string) => void;
};

function StripeProviderForCountry(props: PropTypes): JSX.Element {
	const [stripeObject, setStripeObject] = useState<stripeJs.Stripe | null>(
		null,
	);
	const stripeKey = getStripeKeyForCountry(
		'REGULAR',
		props.country,
		props.currency,
		props.isTestUser,
	);
	useEffect(() => {
		if (stripeObject === null) {
			props.setStripePublicKey(stripeKey);
			void stripeJs.loadStripe(stripeKey).then(setStripeObject);
		}
	}, []);
	// `options` must be set even if it's empty, otherwise we get 'Unsupported prop change on Elements' warnings
	// in the console
	const elementsOptions = {};
	return (
		<Elements stripe={stripeObject} options={elementsOptions}>
			<StripeForm
				submitForm={props.submitForm}
				allErrors={props.allErrors}
				stripeKey={stripeKey}
				validateForm={props.validateForm}
				buttonText={props.buttonText}
				csrf={props.csrf}
				isTestUser={props.isTestUser}
			/>
		</Elements>
	);
}

export { StripeProviderForCountry };
