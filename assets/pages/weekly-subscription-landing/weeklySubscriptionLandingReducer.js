// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type WeeklyBillingPeriod, getWeeklyProductPrice } from 'helpers/subscriptions';
import { type Action } from './weeklySubscriptionLandingActions';


// ----- Subs ------ //
export const billingPeriods = {
  sixweek: {
    title: 'Weekly',
    offer: 'Introductory offer',
    copy: (countryGroupId: CountryGroupId) => `6 issues for 6 pounds and then ${getWeeklyProductPrice(countryGroupId, 'quarter')}`,
  },
  quarter: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getWeeklyProductPrice(countryGroupId, 'quarter')}/quarter`,
  },
  year: {
    title: 'Annually',
    offer: '10% off',
    copy: (countryGroupId: CountryGroupId) => `${getWeeklyProductPrice(countryGroupId, 'year')}/year`,
  },
};


type PageState = {
  period: WeeklyBillingPeriod | null;
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
