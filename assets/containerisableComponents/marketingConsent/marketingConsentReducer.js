// @flow

// ----- Imports ----- //

import type { Action } from './marketingConsentActions';


// ----- Types ----- //

export type State = {
  error: boolean,
};


// ----- Setup ----- //

const initialState: State = {
  error: false,
};


// ----- Reducer ----- //

function marketingConsentReducerFor(scope: string): Function {

  function marketingConsentReducer(state: State = initialState, action: Action): State {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'SET_API_ERROR':
        return { ...state, error: action.error };
      default:
        return state;
    }
  }

  return marketingConsentReducer;
}


// ----- Exports ----- //

export { marketingConsentReducerFor };
