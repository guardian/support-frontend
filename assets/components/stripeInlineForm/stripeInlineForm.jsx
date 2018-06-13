// @flow

// ----- Imports ----- //

import React from 'react';

import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import { type Currency } from 'helpers/internationalisation/currency';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';


// ----- Component ----- //

function checkoutForm(props: {stripe: Object, callback: (token: string) => mixed}) {

  const handleSubmit = (event) => {
    event.preventDefault();

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
        <span className="component-stripe-inline-form__label-content">Enter credit/debit card details</span>
        <CardElement className="component-stripe-inline-form__card-element" hidePostalCode style={{ base: { fontSize: '14px', fontFamily: 'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande', lineHeight: '40px' } }} />
      </label>
      <button className="component-stripe-inline-form__submit-payment">Confirm card payment <SvgArrowRightStraight /></button>
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
