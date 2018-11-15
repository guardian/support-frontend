// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { productPagePeriodFormReducerFor, type State as FormState } from 'components/productPage/productPagePeriodForm/productPagePeriodFormReducer';

export type State = {
  common: CommonState,
  page: FormState<WeeklyBillingPeriod>,
};


// ----- Reducer ----- //

const promoInUrl = getQueryParameter('promo');

const initialPeriod: WeeklyBillingPeriod = promoInUrl === 'sixweek' || promoInUrl === 'quarter' || promoInUrl === 'year'
  ? promoInUrl
  : 'sixweek';


// ----- Export ----- //

export default productPagePeriodFormReducerFor<WeeklyBillingPeriod>('GuardianWeekly', initialPeriod);
