// @flow

// ----- Imports ----- //

import type { Action } from './findOutMoreActions';

// ----- Setup ----- //

export type FindOutMoreState = {
  isPopUpOpen: boolean,
};

const initialState: FindOutMoreState = {
  isPopUpOpen: false,
};

function findOutMoreReducer(
  state: FindOutMoreState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'OPEN_POP_UP':
      return Object.assign({}, state, {
        isPopUpOpen: true,
      });
    case 'CLOSE_POP_UP':
      return Object.assign({}, state, {
        isPopUpOpen: false,
      });

    default:
      return state;
  }
}

export { findOutMoreReducer };
