// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { loadPayPalExpress, setup } from 'helpers/payPalExpressCheckout/payPalExpressCheckout';
import type { Currency } from 'helpers/internationalisation/currency';

// ---- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  csrf: CsrfState,
  callback: Function,
  setHasLoaded: Function,
  hasLoaded: boolean,
};

// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {
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

export default PayPalExpressButton;
