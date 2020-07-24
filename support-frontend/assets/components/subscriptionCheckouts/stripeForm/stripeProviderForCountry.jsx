// @flow

// $FlowIgnore - required for hooks
import * as React from 'preact/compat';
import { Elements } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type {FormError} from "helpers/subscriptionsForms/validation";
import type {FormField} from "helpers/subscriptionsForms/formFields";
import type {Csrf} from "helpers/csrf/csrfReducer";

// Types

type PropTypes = {
  country: IsoCountry,
  isTestUser: boolean,
  allErrors: FormError<FormField>[],
  setStripePaymentMethod: Function,
  submitForm: Function,
  validateForm: Function,
  buttonText: string,
  csrf: Csrf,
};

function StripeProviderForCountry(props: PropTypes) {
  const stripeKey = getStripeKey('REGULAR', props.country, props.isTestUser);
  const stripe = stripeJs.loadStripe(stripeKey);
  return (
    <Elements stripe={stripe}>
      <StripeForm
        submitForm={props.submitForm}
        allErrors={props.allErrors}
        stripeKey={stripeKey}
        setStripePaymentMethod={props.setStripePaymentMethod}
        validateForm={props.validateForm}
        buttonText={props.buttonText}
        csrf={props.csrf}
      />
    </Elements>
  );
}

export { StripeProviderForCountry };
