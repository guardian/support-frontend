// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';

import { userReducer as user } from 'helpers/user/userReducer';
import csrfReducer from 'helpers/csrf/csrfReducer';

import type { CommonState } from 'helpers/page/page';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { Action } from './regularContributionsThankYouActions';


// ----- Types ----- //

export type State = {
  consentApiError: boolean,
};

export type CombinedState = {
  thankYouState: State,
  user: UserState,
  csrf: CsrfState,
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
  csrf: csrfReducer,
});

