// @flow

// ----- Imports ----- //
import { type Stage } from './checkoutFormReducer';

// ----- Types ----- //

export type Action =
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_STAGE', stage: Stage }


// ----- Actions Creators ----- //


export function setCheckoutFormHasBeenSubmitted(): Action {
  return { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' };
}

export function setStage(stage: Stage): Action {
  return { type: 'SET_STAGE', stage };
}

