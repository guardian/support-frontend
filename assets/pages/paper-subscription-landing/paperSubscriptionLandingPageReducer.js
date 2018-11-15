// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type PaperBillingPeriod } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { productPagePeriodFormReducerFor, type State as FormState } from 'components/productPage/productPagePeriodForm/productPagePeriodFormReducer';

export type State = {
  common: CommonState,
  page: FormState<PaperBillingPeriod>,
};


// ----- Reducer ----- //

const promoInUrl = getQueryParameter('promo');

const initialState: FormState<PaperBillingPeriod> = {
  period: promoInUrl === 'sixday' || promoInUrl === 'weekend' || promoInUrl === 'sunday' || promoInUrl === 'month' ? promoInUrl : null,
};


// ----- Export ----- //

export default productPagePeriodFormReducerFor('Paper', initialState);
