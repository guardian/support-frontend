// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';

export type CorporateRedemption = {
  redemptionCode: string,
  corporateName: string,
}

export type RedemptionData = CorporateRedemption

export type RedemptionFormState = {
  userCode: Option<string>,
  error: Option<string>,
};

export type Checkout = {
  stage: string,
}

export type State = {
  common: CommonState,
  page: {
    checkout: Checkout,
    form: RedemptionFormState,
    redemptionData: Option<RedemptionData>,
  }
};

const getRedemptionData = (): Option<RedemptionData> => getGlobal('redemptionData');
const getCheckout = (): Checkout => ({
  stage: getGlobal('stage') || 'checkout',
});
const getForm = (): RedemptionFormState => ({
  userCode: null,
  error: null,
});

// ----- Export ----- //

export default () => combineReducers({
  checkout: getCheckout,
  form: getForm,
  redemptionData: getRedemptionData,
});
