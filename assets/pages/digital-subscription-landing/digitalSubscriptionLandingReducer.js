// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { type DigitalBillingPeriod } from 'helpers/billingPeriods';
import {
  ProductPagePlanFormReducerFor,
  type State as FormState,
} from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';
import promotionPopUpReducer, { type FindOutMoreState } from './components/promotionPopUpReducer';

export type State = {
  common: CommonState,
  page: {
    plan: FormState<DigitalBillingPeriod>,
    promotion: FindOutMoreState
  }
};


// ----- Export ----- //

export default (promoInUrl: ?string) => {

  const initialPeriod: DigitalBillingPeriod = promoInUrl === 'Monthly' || promoInUrl === 'Annual'
    ? promoInUrl
    : 'Annual';

  return combineReducers({
    plan: ProductPagePlanFormReducerFor<DigitalBillingPeriod>('GuardianWeekly', initialPeriod),
    promotion: promotionPopUpReducer,
  });
};
