// @flow

// ----- Imports ----- //

import type { Action } from './payPalContributionButtonActions';


// ----- Types ----- //

export type State = {
  error: ?string,
};


// ----- Setup ----- //

const initialState: State = {
  error: null,
};


// ----- Reducer ----- //

function payPalContributionButtonReducerFor(scope: string): Function {

  function payPalContributionButtonReducer(state: State = initialState, action: Action): State {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'SET_ERROR':
        return { ...state, error: action.error };
      case 'RESET_ERROR':
        return { ...state, error: null };
      default:
        return state;
    }

  }

  return payPalContributionButtonReducer;

}


// ----- Exports ----- //

export {
  payPalContributionButtonReducerFor,
};
