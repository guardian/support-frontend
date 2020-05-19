// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';

export type CorporateCustomer = {
  redemptionCode: string,
  name: string,
}

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
    corporateCustomer: CorporateCustomer,
  }
};

const getCustomer = (): CorporateCustomer => getGlobal('corporateCustomer');
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
  corporateCustomer: getCustomer,
});
