// @flow

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', message: ?string }
    | { type: 'SET_EMAIL_HAS_BEEN_BLURRED' | 'CHECKOUT_SUCCESS' };

// ----- Actions ----- //

function checkoutError(message: ?string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

function checkoutSuccess(): Action {
  return { type: 'CHECKOUT_SUCCESS' };
}

function setEmailHasBeenBlurred(): Action {
  return { type: 'SET_EMAIL_HAS_BEEN_BLURRED' };
}


// ----- Exports ----- //

export { checkoutError, checkoutSuccess, setEmailHasBeenBlurred };
