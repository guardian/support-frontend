import { Elements } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { getStripeKey } from 'helpers/forms/stripe';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';

// Types
export type PropTypes = {
	country: IsoCountry;
	isTestUser: boolean;
	allErrors: Array<FormError<FormField>>;
	submitForm: () => void;
	validateForm: () => void;
	buttonText: string;
	csrf: CsrfState;
};

function StripeProviderForCountry(props: PropTypes): JSX.Element {
	const [stripeObject, setStripeObject] = useState<stripeJs.Stripe | null>(
		null,
	);
	const stripeKey = getStripeKey('REGULAR', props.country, props.isTestUser);
	useEffect(() => {
		if (stripeObject === null) {
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
