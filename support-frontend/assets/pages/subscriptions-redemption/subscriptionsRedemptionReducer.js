// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { Option } from 'helpers/types/option';
import stage from 'components/subscriptionCheckouts/stage';

export type CorporateRedemption = {
  redemptionCode: string,
  corporateAccountId: string,
}

export type RedemptionData = CorporateRedemption

export type CheckoutForm = {
  stage: string,
  userCode: Option<string>,
};

export type State = {
  common: CommonState,
  page: {
    checkout: CheckoutForm,
    redemptionCode: Option<RedemptionData>,
  }
};

const getRedemptionData = (): Option<RedemptionData> => getGlobal('redemptionData');
const getCheckout = (): CheckoutForm => ({
  stage: 'checkout',
  userCode: '123',
});

// ----- Export ----- //

export default () => combineReducers({
  checkout: getCheckout,
  redemptionData: getRedemptionData,
});
