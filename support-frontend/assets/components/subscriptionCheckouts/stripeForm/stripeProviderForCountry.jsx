// @flow

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { type StripeFormPropTypes } from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCountry } from 'helpers/internationalisation/country';

// Types

type PropTypes = {
  ...StripeFormPropTypes,
  country: IsoCountry,
  isTestUser: boolean,
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
