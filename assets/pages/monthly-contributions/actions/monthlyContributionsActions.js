// @flow

// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_BUTTON', value: boolean }
  ;


// ----- Actions ----- //

export function checkoutError(message: string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

export function setPayPalButton(value: boolean): Action {
  return { type: 'SET_PAYPAL_BUTTON', value };
}
