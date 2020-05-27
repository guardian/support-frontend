// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';
import type { User } from 'helpers/subscriptionsForms/user';
import { getUser } from 'helpers/subscriptionsForms/user';


export type Stage = 'form' | 'processing' | 'thankyou' | 'thankyou-pending';
export type CorporateCustomer = {
  redemptionCode: string,
  accountId: string,
  name: string,
}

export type RedemptionFormState = {
  stage: Stage,
  corporateCustomer: Option<CorporateCustomer>,
  userCode: Option<string>,
  error: Option<string>,
  user: User,
}

export type RedemptionPageState = {
  common: CommonState,
  page: RedemptionFormState,
};

// ------- Actions ---------- //
export type Action =
  | { type: 'SET_USER_CODE', userCode: string }
  | { type: 'SET_ERROR', error: Option<string> }
  | { type: 'SET_CORPORATE_CUSTOMER', corporateCustomer: CorporateCustomer }
  | { type: 'SET_STAGE', stage: Stage }

const initialState: RedemptionFormState = {
  corporateCustomer: getGlobal('corporateCustomer'),
  stage: getGlobal('stage') || 'form',
  userCode: getGlobal('userCode'),
  error: getGlobal('error'),
  user: getUser(),
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
    case 'SET_STAGE':
      return { ...previousState, stage: action.stage };
    default:
      return previousState;
  }
};

// ----- Export ----- //

export default () => redemptionFormReducer;
