// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }

// ----- Actions Creators ----- //


export function setCheckoutFormHasBeenSubmitted(): Action {
  return { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' };
}
