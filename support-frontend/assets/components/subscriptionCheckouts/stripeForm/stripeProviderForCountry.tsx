// @ts-ignore - required for hooks
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { getStripeKey } from 'helpers/forms/stripe';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { Csrf } from 'helpers/csrf/csrfReducer';
// Types
type PropTypes = {
	country: IsoCountry;
	isTestUser: boolean;
	allErrors: FormError<FormField>[];
	setStripePaymentMethod: (...args: Array<any>) => any;
	submitForm: (...args: Array<any>) => any;
	validateForm: (...args: Array<any>) => any;
	buttonText: string;
	csrf: Csrf;
};

function StripeProviderForCountry(props: PropTypes) {
	const [stripeObject, setStripeObject] = useState<stripeJs.Stripe | null>(
		null,
	);
	const stripeKey = getStripeKey('REGULAR', props.country, props.isTestUser);
	useEffect(() => {
		if (stripeObject === null) {
			stripeJs.loadStripe(stripeKey).then(setStripeObject);
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
				setStripePaymentMethod={props.setStripePaymentMethod}
				validateForm={props.validateForm}
				buttonText={props.buttonText}
				csrf={props.csrf}
				isTestUser={props.isTestUser}
			/>
		</Elements>
	);
}

export { StripeProviderForCountry };
