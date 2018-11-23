// @flow

// ----- Imports ----- //

import type { ErrorReason } from 'helpers/errorReasons';

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', errorReason: ErrorReason }
    | { type: 'CHECKOUT_SUCCESS' };


// ----- Action Creators ----- //

function checkoutError(errorReason: ErrorReason): Action {
  return { type: 'CHECKOUT_ERROR', errorReason };
}

function checkoutSuccess(): Action {
  return { type: 'CHECKOUT_SUCCESS' };
}

// ----- Exports ----- //

export { checkoutError, checkoutSuccess };
