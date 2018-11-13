// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import { type WeeklyBillingPeriod, getWeeklyProductPrice } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';

import { type Action } from './weeklySubscriptionLandingActions';


// ----- Subs ------ //

const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].glyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

export const billingPeriods = {
  sixweek: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'sixweek')} for the first 6 issues (then quarterly)`,
  },
  quarter: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'quarter')} every 3 months`,
  },
  year: {
    title: 'Annually',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'year')} every 12 months`,
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

const promoInUrl = getQueryParameter('promo');

const initialState: PageState = {
  period: promoInUrl === 'sixweek' || promoInUrl === 'quarter' || promoInUrl === 'year' ? promoInUrl : null,
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
