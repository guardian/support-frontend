// @flow

// ----- Imports ----- //

import React from 'react';

import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import { type Currency } from 'helpers/internationalisation/currency';


// ----- Component ----- //

function checkoutForm(props: {stripe: Object, callback: (token: string) => mixed}) {

  const handleSubmit = (ev) => {
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    props
      .stripe
      .createToken()
      .then(({ token }) => {
        props.callback(token.id);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement hidePostalCode style={{ base: { fontSize: '18px' } }} />
      </label>
      <button>Confirm order</button>
    </form>);
}

const InjectedCheckoutForm = injectStripe(checkoutForm);


type PropTypes = {
  dispatch: () => mixed,
  stripeIsLoaded: () => mixed,
  isStripeLoaded: boolean,
  currency: Currency,
  isTestUser: boolean,
  callback: ()=> mixed,
};

const setupStripeInlineForm = (dispatch: Function, stripeIsLoaded: () => mixed) => {
  const htmlElement = document.querySelector('#stripe-js');

  if (htmlElement !== null) {
    htmlElement.addEventListener(
      'load',
      () => {
        dispatch(stripeIsLoaded());
      },
    );
  }
};
export default function StripeInlineForm(props: PropTypes) {

  if (props.isStripeLoaded === false && window.Stripe === undefined) {
    setupStripeInlineForm(props.dispatch, props.stripeIsLoaded);
    return null;
  }

  return (
    <StripeProvider apiKey={getStripeKey(props.currency.iso, props.isTestUser)}>
      <Elements>
        <InjectedCheckoutForm callback={props.callback} currency={props.currency} />
      </Elements>
    </StripeProvider>
  );
}
