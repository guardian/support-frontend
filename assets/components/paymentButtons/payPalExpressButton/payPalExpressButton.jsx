// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';

import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/switch';
import { loadPayPalExpress, setup } from 'helpers/paymentIntegrations/payPalExpressCheckout';
import type { Currency } from 'helpers/internationalisation/currency';


// ---- Types ----- //

type PropTypes = {|
  amount: number,
  callback: (token: string) => Promise<*>,
  csrf: CsrfState,
  currency: Currency,
  hasLoaded: boolean,
  setHasLoaded: () => void,
  switchStatus: Status,
|};


// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {

  return (
    <Switchable
      status={props.switchStatus}
      component={() => <Button {...props} />}
      fallback={() => <PaymentError paymentMethod="PayPal" modifierClass="paypal-express" />}
    />
  );

}


// ----- Auxiliary Components ----- //

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
  switchStatus: 'ON',
};


// ----- Export ----- //

export default PayPalExpressButton;
