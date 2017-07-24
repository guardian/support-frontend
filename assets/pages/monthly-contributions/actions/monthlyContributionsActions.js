// @flow

// ----- Imports ----- //

import { setStripeAmount } from 'helpers/stripeCheckout/stripeCheckoutActions';
import {
  setPayPalExpressAmount,
} from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';
import validateContribution from 'helpers/contributions';


// ----- Types ----- //

export type Action =
  | { type: 'SET_CONTRIB_VALUE', value: number }
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_BUTTON', value: boolean }
  ;


// ----- Actions ----- //

function setContribValue(value: number): Action {
  return { type: 'SET_CONTRIB_VALUE', value };
}

export function checkoutError(message: string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

export function setPayPalButton(value: boolean): Action {
  return { type: 'SET_PAYPAL_BUTTON', value };
}

export function setContribAmount(amount: string): Function {

  const value = validateContribution(amount, 'RECURRING').amount;

  return (dispatch) => {
    dispatch(setContribValue(value));
    dispatch(setStripeAmount(value));
    dispatch(setPayPalExpressAmount(value));
  };

}
