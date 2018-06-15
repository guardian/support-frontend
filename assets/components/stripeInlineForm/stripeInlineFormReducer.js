// @flow

// ----- Imports ----- //

import type { Action } from './stripeInlineFormActions';


// ----- Types ----- //

export type State = {|
  isStripeLoaded: boolean,
  errorMessage: ?string,
|};


// ----- Setup ----- //

const initialState: State = {
  isStripeLoaded: false,
  errorMessage: null,
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
      default:
        return state;
    }

  }

  return stripeInlineFormReducer;
}


// ----- Exports ----- //

export { stripeInlineFormReducerFor };
