// @flow

// ----- Imports ----- //

import { setStripeAmount } from 'helpers/stripeCheckout/stripeCheckoutActions';
import {
  setPayPalExpressAmount,
} from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';
import { parse as parseContribution } from 'helpers/contributions';


// ----- Types ----- //

export type Action =
  | { type: 'SET_CONTRIB_VALUE', value: number }
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_BUTTON', value: boolean }
  | { type: 'SET_TRACKING_URI', uri: string }
  | { type: 'INCREMENT_POLL_COUNT' }
  | { type: 'RESET_POLL_COUNT' }
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

export function setTrackingUri(uri: string): Action {
  return { type: 'SET_TRACKING_URI', uri };
}

export function incrementPollCount(): Action {
  return { type: 'INCREMENT_POLL_COUNT' };
}

export function resetPollCount(): Action {
  return { type: 'RESET_POLL_COUNT' };
}

export function setContribAmount(amount: string): Function {

  const value = parseContribution(amount, 'RECURRING').amount;

  return (dispatch) => {
    dispatch(setContribValue(value));
    dispatch(setStripeAmount(value));
    dispatch(setPayPalExpressAmount(value));
  };

}
