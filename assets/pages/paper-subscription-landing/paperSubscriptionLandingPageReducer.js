// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

export type State = {
  common: CommonState,
  page: FormState<PaperBillingPlan>,
};


// ----- Reducer ----- //

const promoInUrl = getQueryParameter('promo');

const initialPeriod: ?PaperBillingPlan =
  promoInUrl === 'sixday' || promoInUrl === 'weekend' || promoInUrl === 'sunday' || promoInUrl === 'month' ? promoInUrl : null;


// ----- Export ----- //

export default ProductPagePlanFormReducerFor<?PaperBillingPlan>('Paper', initialPeriod);
