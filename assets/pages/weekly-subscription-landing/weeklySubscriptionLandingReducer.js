// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';

import { type Action } from './weeklySubscriptionLandingActions';


// ----- Subs ------ //
export type SubscriptionWithDetails = {
  title: string,
  offer?: ?string,
  copy: string,
}

type Subscriptions = {
  weekly: SubscriptionWithDetails,
  quarterly: SubscriptionWithDetails,
  annually: SubscriptionWithDetails
}

export const subscriptions: Subscriptions = {
  weekly: {
    title: 'Weekly',
    offer: 'Introductory offer',
    copy: '6 issues for 6 pounds and then £37 every 3 months',
  },
  quarterly: {
    title: 'Quarterly',
    copy: '6 issues for 6 pounds and then £37 every 3 months',
  },
  annually: {
    title: 'Annually',
    offer: '10% off',
    copy: '6 issues for 6 pounds and then £37 every 3 months',
  },
};

export type Subscription = $Keys<typeof subscriptions>;

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
