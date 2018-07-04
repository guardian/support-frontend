// @flow

// ----- Imports ----- //

import type { Action } from './stripeInlineFormActions';


// ----- Types ----- //

export type State = {|
  isStripeLoaded: boolean,
  errorMessage: ?string,
  isSubmitButtonDisable: boolean,
|};


// ----- Setup ----- //

const initialState: State = {
  isStripeLoaded: false,
  errorMessage: null,
  isSubmitButtonDisable: false,
};


// ----- Reducer ----- //

function stripeInlineFormReducerFor(scope: string): Function {

  function stripeInlineFormReducer(state: State = initialState, action: Action): State {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'STRIPE_IS_LOADED':
        return { ...state, isStripeLoaded: true };
      case 'SET_ERROR':
        return { ...state, errorMessage: action.message };
      case 'RESET_ERROR':
        return { ...state, errorMessage: null };
      case 'DISABLE_SUBMIT_BUTTON':
        return { ...state, isSubmitButtonDisable: true };
      case 'ENABLE_SUBMIT_BUTTON':
        return { ...state, isSubmitButtonDisable: false };
      default:
        return state;
    }

  }

  return stripeInlineFormReducer;
}


// ----- Exports ----- //

export { stripeInlineFormReducerFor };
