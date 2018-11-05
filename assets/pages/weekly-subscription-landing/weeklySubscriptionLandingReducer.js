// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';

import { type Action } from './weeklySubscriptionLandingActions';


// ----- Types ----- //

export type Subscription = 'weekly' | 'monthly' | 'quarterly';

type PageState = {
  subscription: Subscription;
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducer ----- //

const initialState = {
  subscription: 'weekly',
};

function reducer(state: PageState = initialState, action: Action): PageState {

  switch (action.type) {

    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.subscription };

    default:
      return state;

  }

}


// ----- Export ----- //

export default reducer;
