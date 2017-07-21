// @flow

// ----- Imports ----- //

import * as payPalExpressCheckout from './payPalExpressCheckout';

// ----- Types ----- //

export type Action =
  | { type: 'START_PAYPAL_EXPRESS_CHECKOUT' }
  | { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount: number }
  | { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' }
  | { type: 'PAYPAL_EXPRESS_ERROR', message: string }
  ;

// ----- Actions ----- //

function startPayPalExpressCheckout(): Action {
  return { type: 'START_PAYPAL_EXPRESS_CHECKOUT' };
}

export function setPayPalExpressAmount(amount: number): Action {
  return { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount };
}

function payPalExpressCheckoutLoaded(): Action {
  return { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' };
}

export function payPalExpressError(message: string): Action {
  return { type: 'PAYPAL_EXPRESS_ERROR', message };
}


// ----- Functions -----//

export function setupPayPalExpressCheckout(callback: Function): Function {

  return (dispatch, getState) => {

    dispatch(startPayPalExpressCheckout());

    return payPalExpressCheckout
      .setup(dispatch, getState, callback)
      .then(() => dispatch(payPalExpressCheckoutLoaded()));
  };
}
