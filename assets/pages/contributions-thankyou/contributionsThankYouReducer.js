// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';

import { userReducer as user } from 'helpers/user/userReducer';

import type { CommonState } from 'helpers/page/page';

import type { Action } from './contributionsThankYouActions';


// ----- Types ----- //

export type State = {
  consentApiError: boolean,
};

export type CombinedState = {
  thankYouState: State,
  user: UserState,
};

export type PageState = {
  common: CommonState,
  page: CombinedState,
}


// ----- Reducers ----- //

function createThankYouReducer() {

  const initialState: State = {
    consentApiError: false,
  };

  return function thankYouReducer(state: State = initialState, action: Action): State {

    switch (action.type) {

      case 'CONSENT_API_ERROR':
        return Object.assign({}, state, { consentApiError: action.consentApiError });
      default:
        return state;

    }
  };
}


// ----- Exports ----- //


export default combineReducers({
  thankYouState: createThankYouReducer(),
  user,
});

