// @flow

// ----- Imports ----- //

import type { Action } from './stripeInlineFormActions';


// ----- Types ----- //

export type State = {|
  isStripeLoaded: boolean,
|};


// ----- Setup ----- //

const initialState: State = {
  isStripeLoaded: false,
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
      default:
        return state;
    }

  }

  return stripeInlineFormReducer;
}


// ----- Exports ----- //

export { stripeInlineFormReducerFor };
