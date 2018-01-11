// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';


import { userReducer as user } from 'helpers/user/userReducer';
import type { Action } from './contributionsThankyouActions';
import type { User as UserState } from '../../helpers/user/userReducer';
import type { CommonState } from '../../helpers/page/page';


export type State = {
  marketingPreferencesSelected: boolean,
};

export type CombinedState = {
  regularContributionsThankYou: State,
  user: UserState,
};

export type PageState = {
  common: CommonState,
  page: CombinedState,
}

// ----- Reducers ----- //


const initialState: State = {
  marketingPreferencesSelected: false,
};

function regularContributionsThankYouReducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'MARKETING_PREFERENCES_SELECTED':
      return Object.assign({}, state, { marketingPreferencesSelected: true });
    default:
      return state;

  }
}

// ----- Exports ----- //

export default combineReducers({
  regularContributionsThankYou: regularContributionsThankYouReducer,
  user,
});

