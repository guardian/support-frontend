// @flow

import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
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
  return (
    <StripeProvider apiKey={stripeKey}>
      <Elements>
        <StripeForm
          component={props.component}
          submitForm={props.submitForm}
          allErrors={props.allErrors}
          setStripeToken={props.setStripeToken}
          name={props.name}
          validateForm={props.validateForm}
          buttonText={props.buttonText}
        />
      </Elements>
    </StripeProvider>
  );
}

export { StripeProviderForCountry };
