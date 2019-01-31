// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type PaperDeliveryMethod, type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';


// ----- Types ----- //

export type ActiveTabState = PaperDeliveryMethod;

export type State = {
  common: CommonState,
  page: {
    tab: ActiveTabState,
    plan: FormState<PaperBillingPlan>,
  }
};


// ----- Helpers ----- //

const getTabsReducer = (initialTab: PaperDeliveryMethod) =>
  (state: ActiveTabState = initialTab, action: TabActions): ActiveTabState => {

    switch (action.type) {
      case 'SET_TAB':
        return action.tab;
      default:
        return state;
    }

  };


// ----- Exports ----- //

export default (initialTab: PaperDeliveryMethod, promoInUrl: ?string) => {

  const initialPeriod: ?PaperBillingPlan =
    promoInUrl === 'collectionEveryday' || promoInUrl === 'collectionSixday' ||
    promoInUrl === 'collectionWeekend' || promoInUrl === 'collectionSunday' ||
    promoInUrl === 'deliveryEveryday' || promoInUrl === 'deliverySixday' ||
    promoInUrl === 'deliveryWeekend' || promoInUrl === 'deliverySunday' ? promoInUrl : null;

  return combineReducers({
    plan: ProductPagePlanFormReducerFor<?PaperBillingPlan>('Paper', initialPeriod),
    tab: getTabsReducer(initialTab),
  });
};
