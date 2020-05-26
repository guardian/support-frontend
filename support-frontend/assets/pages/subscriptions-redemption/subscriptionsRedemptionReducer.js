// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';

export type CorporateCustomer = {
  redemptionCode: string,
  name: string,
}

export type Checkout = {
  stage: string,
}

export type RedemptionFormState = {
  checkout: Checkout,
  corporateCustomer: Option<CorporateCustomer>,
  userCode: Option<string>,
  error: Option<string>,
}

export type RedemptionPageState = {
  common: CommonState,
  page: RedemptionFormState
};

// ------- Actions ---------- //
export type Action =
  | { type: 'SET_USER_CODE', userCode: string }
  | { type: 'SET_ERROR', error: string }
  | { type: 'SET_CORPORATE_CUSTOMER', corporateCustomer: CorporateCustomer }

const initialState: RedemptionFormState = {
  corporateCustomer: getGlobal('corporateCustomer'),
  checkout: { stage: getGlobal('stage') || 'checkout' },
  userCode: getGlobal('userCode'),
  error: getGlobal('error'),
};

const redemptionFormReducer = (
  previousState: RedemptionFormState = initialState,
  action: Action,
): RedemptionFormState => {
  switch (action.type) {
    case 'SET_USER_CODE':
      return { ...previousState, userCode: action.userCode };
    case 'SET_ERROR':
      return { ...previousState, error: action.error };
    case 'SET_CORPORATE_CUSTOMER':
      return { ...previousState, corporateCustomer: action.corporateCustomer };
    default:
      return previousState;
  }
};

// ----- Export ----- //

export default () => redemptionFormReducer;
