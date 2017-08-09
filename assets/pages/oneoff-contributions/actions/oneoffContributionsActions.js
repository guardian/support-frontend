// @flow

// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_ERROR', message: string }
  ;


// ----- Actions ----- //

export function checkoutError(message: string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}
