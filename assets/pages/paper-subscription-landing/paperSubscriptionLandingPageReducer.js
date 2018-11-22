// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';
import { type Tab } from './components/tabs';
import { type TabActions } from './paperSubscriptionLandingPageActions';

// ----- Tabs ----- //

type TabsState = {
  active: Tab
}

const tabsReducer = (state: TabsState = {
  active: 'collection',
}, action: TabActions): TabsState => {

  switch (action.type) {

    case 'SET_TAB':
      return { ...state, active: action.tab };

    default:
      return state;

  }

};

// ----- Exports ----- //

export type State = {
  common: CommonState,
  page: {
    tabs: TabsState,
    plan: FormState<PaperBillingPlan>,
  }
};

export default () => {
  const promoInUrl = getQueryParameter('promo');

  const initialPeriod: ?PaperBillingPlan =
    promoInUrl === 'sixday' || promoInUrl === 'weekend' || promoInUrl === 'sunday' || promoInUrl === 'everyday' ? promoInUrl : null;

  return combineReducers({
    plan: ProductPagePlanFormReducerFor<?PaperBillingPlan>('Paper', initialPeriod),
    tabs: tabsReducer,
  });
};
