// @flow

// ----- Types ----- //

export type Action = { type: 'CHECKOUT_ERROR', message: ?string };


// ----- Actions ----- //

function checkoutError(message: ?string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}


// ----- Exports ----- //

export { checkoutError };
