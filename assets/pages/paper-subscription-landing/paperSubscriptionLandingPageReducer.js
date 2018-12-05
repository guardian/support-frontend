// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type Option } from 'helpers/types/option';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';


// ----- Types ----- //

export type PaperPrices = {
  collectionEveryday: Option<number>,
  collectionSixday: Option<number>,
  collectionWeekend: Option<number>,
  collectionSunday: Option<number>,

  deliveryEveryday: Option<number>,
  deliverySixday: Option<number>,
  deliveryWeekend: Option<number>,
  deliverySunday: Option<number>,
};

type ActiveTabState = PaperDeliveryMethod;

export type State = {
  common: CommonState,
  page: {
    tab: ActiveTabState,
    prices: PaperPrices,
    plan: FormState<PaperBillingPlan>,
  }
};


// ----- Helpers ----- //

const getPriceAsFloat = (price): Option<number> => (price ? parseFloat(price) : null);

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

export default (initialTab: PaperDeliveryMethod, dataset: Object, promoInUrl: ?string) => {

  const prices: PaperPrices = {
    collectionEveryday: getPriceAsFloat(dataset.collectionEveryday),
    collectionSixday: getPriceAsFloat(dataset.collectionSixday),
    collectionWeekend: getPriceAsFloat(dataset.collectionWeekend),
    collectionSunday: getPriceAsFloat(dataset.collectionSunday),

    deliveryEveryday: getPriceAsFloat(dataset.deliveryEveryday),
    deliveryWeekend: getPriceAsFloat(dataset.deliveryWeekend),
    deliverySixday: getPriceAsFloat(dataset.deliverySixday),
    deliverySunday: getPriceAsFloat(dataset.deliverySunday),
  };


  const initialPeriod: ?PaperBillingPlan =
    promoInUrl === 'collectionEveryday' || promoInUrl === 'collectionSixday' ||
    promoInUrl === 'collectionWeekend' || promoInUrl === 'collectionSunday' ||
    promoInUrl === 'deliveryEveryday' || promoInUrl === 'deliverySixday' ||
    promoInUrl === 'deliveryWeekend' || promoInUrl === 'deliverySunday' ? promoInUrl : null;

  return combineReducers({
    plan: ProductPagePlanFormReducerFor<?PaperBillingPlan>('Paper', initialPeriod),
    tab: getTabsReducer(initialTab),
    prices: () => prices,
  });
};
