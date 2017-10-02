// @flow

// ----- Imports ----- //

import type { PayPalButtonType } from 'components/paymentMethods/paymentMethods';

// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_ERROR', message: ?string }
  | { type: 'SET_PAYPAL_BUTTON', value: PayPalButtonType }
  ;


// ----- Actions ----- //

export function checkoutError(message: ?string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

export function setPayPalButton(value: PayPalButtonType): Action {
  return { type: 'SET_PAYPAL_BUTTON', value };
}
