// @flow

// ----- Imports ----- //

import type { Action } from './marketingConsentActions';


// ----- Types ----- //

export type State = {
  error: boolean,
  confirmOptIn: ?boolean,
  loading: boolean,
};


// ----- Setup ----- //

const initialState: State = {
  error: false,
  confirmOptIn: null,
  loading: false,
};


// ----- Reducer ----- //

function marketingConsentReducerFor(scope: string): Function {

  const marketingConsentReducer = (state: State = initialState, action: Action): State => {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'SET_API_ERROR':
        return { ...state, error: action.error };

      case 'SET_CONFIRM_MARKETING_CONSENT':
        return { ...state, confirmOptIn: action.confirmOptIn };

      case 'SET_LOADING':
        return { ...state, loading: action.loading };

      default:
        return state;
    }
  };

  return marketingConsentReducer;
}


// ----- Exports ----- //

export { marketingConsentReducerFor };
