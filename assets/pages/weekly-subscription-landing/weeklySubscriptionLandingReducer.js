// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { type Action } from './weeklySubscriptionLandingActions';


// ----- Subs ------ //
export type BillingPeriodWithDetails = {
  title: string,
  offer?: ?string,
  copy: string,
}

export const billingPeriods: {
  [WeeklyBillingPeriod]: BillingPeriodWithDetails
} = {
  sixweek: {
    title: 'Weekly',
    offer: 'Introductory offer',
    copy: '6 issues for 6 pounds and then £37 every 3 months',
  },
  quarter: {
    title: 'Quarterly',
    copy: '6 issues for 6 pounds and then £37 every 3 months',
  },
  year: {
    title: 'Annually',
    offer: '10% off',
    copy: '6 issues for 6 pounds and then £37 every 3 months',
  },
};


type PageState = {
  period?: WeeklyBillingPeriod;
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducer ----- //

const initialState: PageState = {
  period: 'sixweek',
};

function reducer(state: PageState = initialState, action: Action): PageState {

  switch (action.type) {

    case 'SET_PERIOD':
      return { ...state, period: action.period };

    default:
      return state;

  }

}


// ----- Export ----- //

export default reducer;
