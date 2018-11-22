// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';
import { tabsReducer, type TabsState } from './components/tabsReducer';

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
