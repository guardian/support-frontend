// @flow

// ----- Imports ----- //

import React from 'react';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { setup } from 'helpers/payPalExpressCheckout/payPalExpressCheckout';
import type { Currency } from '../../helpers/internationalisation/currency';

// ---- Types ----- //

type PropTypes = {
  amount: number,
  currency: Currency,
  csrf: CsrfState,
  callback: Function,
};

// ----- Functions ----- //

function isPayPalSetup(): boolean {
  return window.paypal !== undefined;
}


// ----- Component ----- //

const PayPalExpressButton = (props: PropTypes) => {
  const payPalId = 'component-paypal-button-checkout';
  if (!isPayPalSetup()) {
    const payPalPromise = setup(
      props.amount,
      props.currency,
      props.csrf,
      props.callback,
    );
    payPalPromise.then((payPalOptions) => {
      window.paypal.Button.render(payPalOptions, `#${payPalId}`);
    });
  };
};

export default PayPalExpressButton;
