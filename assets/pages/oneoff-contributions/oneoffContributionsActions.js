// @flow

// ----- Imports ----- //

import type { PayPalButtonType } from './components/oneoffContributionsPayment';


// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_ERROR', message: ?string }
  | { type: 'SET_PAYPAL_BUTTON', value: PayPalButtonType };


// ----- Actions ----- //

function checkoutError(message: ?string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

function setPayPalButton(value: PayPalButtonType): Action {
  return { type: 'SET_PAYPAL_BUTTON', value };
}

// ----- Exports ----- //

export {
  checkoutError,
  setPayPalButton,
};
