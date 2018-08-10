// @flow

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', message: ?string }
    | { type: 'CHECKOUT_SUCCESS' };


// ----- Action Creators ----- //

function checkoutError(message: ?string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

function checkoutSuccess(): Action {
  return { type: 'CHECKOUT_SUCCESS' };
}

// ----- Exports ----- //

export { checkoutError, checkoutSuccess };
