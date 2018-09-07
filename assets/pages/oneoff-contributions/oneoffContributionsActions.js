// @flow

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', message: ?string }
    | { type: 'CHECKOUT_SUCCESS' };


// ----- Action Creators ----- //

function checkoutError(specificError: ?string): Action {
  const defaultError = 'The transaction was temporarily declined. Please try entering your payment details again. Alternatively, try another payment method.';
  const message = specificError || defaultError;
  return { type: 'CHECKOUT_ERROR', message };
}

function checkoutSuccess(): Action {
  return { type: 'CHECKOUT_SUCCESS' };
}

// ----- Exports ----- //

export { checkoutError, checkoutSuccess };
