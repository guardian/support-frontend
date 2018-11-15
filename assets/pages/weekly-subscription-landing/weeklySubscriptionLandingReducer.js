// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import { type WeeklyBillingPeriod, getWeeklyProductPrice } from 'helpers/subscriptions';
import { getQueryParameter } from 'helpers/url';
import { productPagePeriodFormReducerFor, type State as FormState } from './components/productPagePeriodFormReducer';

// ----- Subs ------ //

const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

export const billingPeriods = {
  sixweek: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'sixweek')} for the first 6 issues (then ${getPrice(countryGroupId, 'quarter')} quarterly)`,
  },
  quarter: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'quarter')} every 3 months`,
  },
  year: {
    title: 'Annually',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'year')} every 12 months`,
  },
};


export type State = {
  common: CommonState,
  page: FormState<WeeklyBillingPeriod>,
};


// ----- Reducer ----- //

const promoInUrl = getQueryParameter('promo');

const initialState: FormState<WeeklyBillingPeriod> = {
  period: promoInUrl === 'sixweek' || promoInUrl === 'quarter' || promoInUrl === 'year' ? promoInUrl : 'sixweek',
};


// ----- Export ----- //

export default productPagePeriodFormReducerFor('GuardianWeekly', initialState);
