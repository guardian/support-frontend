// @flow

// ----- Imports ----- //

import type { Action } from './actions';


// ----- Types ----- //

export type VisitToken = {
    token: ?string,
};


// ----- Setup ----- //

const initialState: VisitToken = window.guardian && window.guardian.visitToken ? {
  token: window.guardian.visitToken,
} : {
  token: null,
};


// ----- Reducer ----- //

export default function visitTokenReducer(
  state: VisitToken = initialState,
  action: Action,
): VisitToken {

  switch (action.type) {

    case 'SET_VISIT_TOKEN':
      return Object.assign({}, state, { token: action.name });

    default:
      return state;

  }

}
