// @flow

import * as React from 'react';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { Elements, StripeProvider } from 'react-stripe-elements';
import type { StripeFormPropTypes } from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Option } from 'helpers/types/option';


type PropTypes = {
  ...StripeFormPropTypes,
  stripeKey: string,
};

export default function StripeProviderWrapper(props: PropTypes) {
    return (
      <StripeProvider apiKey={props.stripeKey}>
        <Elements>
          <StripeForm
            key={props.stripeKey}
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
