// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type Option } from 'helpers/types/option';
import { getQueryParameter } from 'helpers/url';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

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

export type State = {
  common: CommonState,
  page: {
    prices: PaperPrices,
    plan: FormState<PaperBillingPlan>,
  }
};

const getPriceAsFloat = (price): Option<number> => (price ? parseFloat(price) : null);


export default (dataset: Object) => {

  const promoInUrl = getQueryParameter('promo');

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
    prices: () => prices,
  });
};
