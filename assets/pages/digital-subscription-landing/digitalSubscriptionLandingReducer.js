// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type WeeklyBillingPeriod } from 'helpers/billingPeriods';
import {
  ProductPagePlanFormReducerFor,
  type State as FormState,
} from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';
import promotionPopUpReducer, { type FindOutMoreState } from './components/promotionPopUpReducer';

export type State = {
  common: CommonState,
  page: {
    plan: FormState<WeeklyBillingPeriod>,
    promotion: FindOutMoreState
  }
};


// ----- Export ----- //

export default (promoInUrl: ?string) => {

  const initialPeriod: WeeklyBillingPeriod = promoInUrl === 'SixForSix' || promoInUrl === 'Quarterly' || promoInUrl === 'Annual'
    ? promoInUrl
    : 'SixForSix';

  return combineReducers({
    plan: ProductPagePlanFormReducerFor<WeeklyBillingPeriod>('GuardianWeekly', initialPeriod),
    promotion: promotionPopUpReducer,
  });
};
