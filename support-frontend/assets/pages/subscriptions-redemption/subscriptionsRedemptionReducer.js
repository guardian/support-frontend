// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';

export type CorporateRedemption = {
  redemptionCode: string,
  corporateAccountId: string,
}

export type RedemptionData = CorporateRedemption

export type RedemptionFormState = {
  stage: string,
  userCode: Option<string>,
};

export type State = {
  common: CommonState,
  page: {
    checkout: RedemptionFormState,
    redemptionCode: Option<RedemptionData>,
  }
};

const getRedemptionData = (): Option<RedemptionData> => getGlobal('redemptionData');
const getForm = (): RedemptionFormState => ({
  stage: 'checkout',
  userCode: '123',
});

// ----- Export ----- //

export default () => combineReducers({
  checkout: getForm,
  redemptionData: getRedemptionData,
});
