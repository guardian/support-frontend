// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';

// ------- Actions ---------- //
export type Action =
  | { type: 'SET_USER_CODE', userCode: String }
  | { type: 'SET_ERROR', error: String }


export type CorporateCustomer = {
  redemptionCode: string,
  name: string,
}

export type Checkout = {
  stage: string,
}

export type RedemptionPageState = {
  common: CommonState,
  page: {
    checkout: Checkout,
    corporateCustomer: Option<CorporateCustomer>,
    userCode: Option<string>,
    error: Option<string>,
    setUserCode: string => void,
  }
};
//
// const getCustomer = (): Option<CorporateCustomer> => getGlobal('corporateCustomer');
// const getCheckout = (): Checkout => ({
//   stage: getGlobal('stage') || 'checkout',
// });
// const getForm = (): RedemptionFormState => ({
//   userCode: getGlobal('userCode'),
//   error: getGlobal('error'),
// });

const initialState = {
  customer: getGlobal('corporateCustomer'),
  checkout: { stage: getGlobal('stage') || 'checkout' },
  userCode: getGlobal('userCode'),
  error: getGlobal('error'),
};

const createReducer = (previousState: RedemptionPageState, action: Action) => {
  switch (action.type) {
    case 'SET_USER_CODE':
      return { ...previousState, userCode: action.userCode };
    case 'SET_ERROR':
      return { ...previousState, error: action.error };
    default:
      return initialState;
  }
};

// ----- Export ----- //

export default () => createReducer;
