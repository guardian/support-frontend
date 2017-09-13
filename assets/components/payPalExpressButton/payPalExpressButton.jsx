// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import * as payPalExpressCheckout from 'helpers/payPalExpressCheckout/payPalExpressCheckout';

import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ---- Types ----- //

type PropTypes = {
  dispatch: Function,
  callback: Function,
  csrfToken: string,
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
};


function setupPayPalExpressCheckout(
  csrfToken: string,
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
  callback: Function,
  payPalId: string,
): Function {

  return (dispatch, getState) => {
    const baidCallback = baid => callback(baid, dispatch, getState);

    const failureCallback = (error: string) => console.log(error);

    payPalExpressCheckout
      .setup(csrfToken, amount, billingPeriod, currency, baidCallback, failureCallback, payPalId);
  };
}


// ----- Component ----- //

const PayPalExpressButton = (props: PropTypes) => {
  const payPalId = 'component-paypal-button-checkout';
  props.dispatch(setupPayPalExpressCheckout(
    props.csrfToken,
    props.amount,
    props.billingPeriod,
    props.currency,
    props.callback,
    payPalId,
  ));
  return <div id={payPalId} className="component-paypal-button-checkout" />;
};


// ----- Exports ----- //

export default connect()(PayPalExpressButton);
