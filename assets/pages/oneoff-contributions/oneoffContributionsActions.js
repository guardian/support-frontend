// @flow

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', message: ?string }
    | { type: 'SET_EMAIL_HAS_BEEN_BLURRED' };

// ----- Actions ----- //

function checkoutError(message: ?string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

function setEmailHasBeenBlurred(): Action {
  return { type: 'SET_EMAIL_HAS_BEEN_BLURRED' };
}

// ----- Exports ----- //

export { checkoutError, setEmailHasBeenBlurred };
