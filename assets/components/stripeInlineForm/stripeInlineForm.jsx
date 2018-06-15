// @flow

// ----- Imports ----- //

import React from 'react';

import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import { type Currency } from 'helpers/internationalisation/currency';
import { type Status } from 'helpers/switch';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  stripeIsLoaded: void => void,
  isStripeLoaded: boolean,
  currency: Currency,
  isTestUser: boolean,
  callback: () => mixed,
  switchStatus: Status,
};
/* eslint-enable react/no-unused-prop-types */


// ---- Auxiliary functions ----- //

const setupStripeInlineForm = (stripeIsLoaded: () => void) => {
  const htmlElement = document.getElementById('stripe-js');

  if (htmlElement !== null) {
    htmlElement.addEventListener(
      'load',
      stripeIsLoaded,
    );
  }
};


// ----- Component ----- //

function StripeInlineFormComp(props: PropTypes) {

  if (props.isStripeLoaded === false && window.Stripe === undefined) {
    setupStripeInlineForm(props.stripeIsLoaded);
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

const StripeInlineForm = (props: PropTypes) => (
  <Switchable
    status={props.switchStatus}
    component={() => <StripeInlineFormComp {...props} />}
    fallback={() => <PaymentError paymentMethod="credit/debit card" />}
  />
);

// ----- Auxiliary components ----- //

const stripeElementsStyle = {
  base:
    {
      fontSize: '14px',
      fontFamily: '\'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\'',
      lineHeight: '40px',
    },
};

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
    <form className="component-stripe-inline-form" onSubmit={handleSubmit}>
      <label>
        <span className="component-stripe-inline-form__label-content">Enter credit/debit card details</span>
        <CardElement className="component-stripe-inline-form__card-element" hidePostalCode style={stripeElementsStyle} />
      </label>
      <button className="component-stripe-inline-form__submit-payment">Confirm card payment <SvgArrowRightStraight /></button>
    </form>);
}

const InjectedCheckoutForm = injectStripe(checkoutForm);

export default StripeInlineForm;
