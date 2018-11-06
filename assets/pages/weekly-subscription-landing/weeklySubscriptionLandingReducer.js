// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type WeeklyBillingPeriod, displayPrice } from 'helpers/subscriptions';
import { type Action } from './weeklySubscriptionLandingActions';


// ----- Subs ------ //
export type BillingPeriodWithDetails = {
  title: string,
  offer?: ?string,
  copy: (countryGroupId: CountryGroupId) => string,
}

export const billingPeriods: {
  [WeeklyBillingPeriod]: BillingPeriodWithDetails
} = {
  sixweek: {
    title: 'Weekly',
    offer: 'Introductory offer',
    copy: countryGroupId => `6 issues for 6 pounds and then ${displayPrice('GuardianWeekly', countryGroupId, 'quarter')}`,
  },
  quarter: {
    title: 'Quarterly',
    copy: countryGroupId => `${displayPrice('GuardianWeekly', countryGroupId, 'quarter')}/quarter`,
  },
  year: {
    title: 'Annually',
    offer: '10% off',
    copy: countryGroupId => `${displayPrice('GuardianWeekly', countryGroupId, 'year')}/year`,
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
