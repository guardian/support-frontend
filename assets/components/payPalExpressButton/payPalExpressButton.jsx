// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { loadPayPalExpress, setup } from 'helpers/payPalExpressCheckout/payPalExpressCheckout';
import type { Currency } from '../../helpers/internationalisation/currency';

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
/* eslint-disable react/prefer-stateless-function */
class PayPalExpressButton extends React.Component {
  render() {
    if (this.props.hasLoaded) {
      const payPalOptions = setup(
        this.props.amount,
        this.props.currency,
        this.props.csrf,
        this.props.callback,
      );
      const PayPalButton = window.paypal.Button.driver('react', { React, ReactDOM });
      return (
        <div id="component-paypal-button-checkout" className="component-paypal-button-checkout">
          <PayPalButton {...payPalOptions} />
        </div>
      );
    } else {
      loadPayPalExpress().then(this.props.setHasLoaded);
      return null;
    }
  }
}

export default PayPalExpressButton;
