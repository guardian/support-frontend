// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';

import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';

// ----- Tabs ----- //

type TabsState = {
  active: PaperDeliveryMethod
}

const getTabsReducer = (initialTab: PaperDeliveryMethod) =>
  (state: TabsState = {
    active: initialTab,
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

export default (initialTab: PaperDeliveryMethod) => {
  const promoInUrl = getQueryParameter('promo');

  const initialPeriod: ?PaperBillingPlan =
    promoInUrl === 'collectionEveryday' || promoInUrl === 'collectionSixday' ||
    promoInUrl === 'collectionWeekend' || promoInUrl === 'collectionSunday' ||
    promoInUrl === 'deliveryEveryday' || promoInUrl === 'deliverySixday' ||
    promoInUrl === 'deliveryWeekend' || promoInUrl === 'deliverySunday' ? promoInUrl : null;

  return combineReducers({
    plan: ProductPagePlanFormReducerFor<?PaperBillingPlan>('Paper', initialPeriod),
    tabs: getTabsReducer(initialTab),
  });
};
