// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { getQueryParameter } from 'helpers/url';
import {
  ProductPagePlanFormReducerFor,
  type State as FormState,
} from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

export type State = {
  common: CommonState,
  page: FormState<WeeklyBillingPeriod>,
};


// ----- Reducer ----- //

const promoInUrl = getQueryParameter('promo');

const initialPeriod: WeeklyBillingPeriod = promoInUrl === 'SixForSix' || promoInUrl === 'Quarterly' || promoInUrl === 'Annual'
  ? promoInUrl
  : 'SixForSix';


// ----- Export ----- //

export default ProductPagePlanFormReducerFor<WeeklyBillingPeriod>('GuardianWeekly', initialPeriod);
