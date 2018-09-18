// @flow

// ----- Imports ----- //

import type { PaymentMethod } from 'helpers/checkouts';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';


// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_PENDING', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_SUCCESS', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_ERROR', checkoutFailureReason: CheckoutFailureReason }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | { type: 'CREATING_CONTRIBUTOR' };

// ----- Actions ----- //

function checkoutPending(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_PENDING', paymentMethod };
}

function checkoutSuccess(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_SUCCESS', paymentMethod };
}

function checkoutError(checkoutFailureReason: CheckoutFailureReason): Action {
  return { type: 'CHECKOUT_ERROR', checkoutFailureReason };
}

function setPayPalHasLoaded(): Action {
  return { type: 'SET_PAYPAL_HAS_LOADED' };
}

function creatingContributor(): Action {
  return { type: 'CREATING_CONTRIBUTOR' };
}

function setGuestAccountCreationToken(guestAccountCreationToken: string): Action {
  return { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken };
}

// ----- Exports ----- //

export {
  checkoutPending,
  checkoutSuccess,
  checkoutError,
  setPayPalHasLoaded,
  creatingContributor,
  setGuestAccountCreationToken,
};
