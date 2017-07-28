// @flow

import type { PayPalButtonType } from 'components/paymentMethods/paymentMethods';

// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_BUTTON', value: PayPalButtonType }
  | { type: 'SET_TRACKING_URI', uri: string }
  | { type: 'INCREMENT_POLL_COUNT' }
  | { type: 'RESET_POLL_COUNT' }
  ;


// ----- Actions ----- //

export function checkoutError(message: string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

export function setPayPalButton(value: PayPalButtonType): Action {
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

