// @flow

// ----- Imports ----- //

import type { CheckoutFailureReason } from 'helpers/checkoutErrors';

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', checkoutFailureReason: CheckoutFailureReason }
    | { type: 'CHECKOUT_SUCCESS' };


// ----- Action Creators ----- //

function checkoutError(checkoutFailureReason: CheckoutFailureReason): Action {
  return { type: 'CHECKOUT_ERROR', checkoutFailureReason };
}

function checkoutSuccess(): Action {
  return { type: 'CHECKOUT_SUCCESS' };
}

// ----- Exports ----- //

export { checkoutError, checkoutSuccess };
