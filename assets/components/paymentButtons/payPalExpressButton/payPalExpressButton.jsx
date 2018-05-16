// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { loadPayPalExpress, setup } from 'helpers/payPalExpressCheckout/payPalExpressCheckout';
import type { Currency } from 'helpers/internationalisation/currency';


// ---- Types ----- //

type Switch = 'Hide' | 'HideWithError' | 'Show';

/* eslint-disable react/require-default-props */
type PropTypes = {
  amount: number,
  currency: Currency,
  csrf: CsrfState,
  callback: Function,
  setHasLoaded: Function,
  hasLoaded: boolean,
  switch?: Switch,
};
/* eslint-enable react/require-default-props */


// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {

  if (props.switch === 'Hide') {
    return null;
  } else if (props.switch === 'HideWithError') {
    return <ErrorMessage />;
  }

  return <Button {...props} />;

}


// ----- Auxiliary Components ----- //

function ErrorMessage() {
  return (
    <div className="component-paypal-button-checkout">
      <p className="component-paypal-button-checkout__error-message">
        We are currently experiencing issues with PayPal payments.
        Please use another payment method or try again later.
      </p>
    </div>
  );
}

function Button(props: PropTypes) {

  if (!props.hasLoaded) {
    loadPayPalExpress().then(props.setHasLoaded);
    return null;
  }

  const payPalOptions = setup(
    props.amount,
    props.currency,
    props.csrf,
    props.callback,
  );

  const PayPalButton = window.paypal.Button.driver('react', { React, ReactDOM });

  return (
    <div id="component-paypal-button-checkout" className="component-paypal-button-checkout">
      <PayPalButton {...payPalOptions} />
    </div>
  );

}


// ----- Default Props ----- //

PayPalExpressButton.defaultProps = {
  switch: 'Show',
};


// ----- Export ----- //

export default PayPalExpressButton;
