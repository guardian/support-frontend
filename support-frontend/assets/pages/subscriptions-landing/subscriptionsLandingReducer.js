// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { SubscriptionProduct } from 'helpers/subscriptions';

export type State = {
  common: CommonState,
  page: {
    pricingCopy: PricingCopy,
  }
};

export type PriceCopy = {
  price: number,
  discountCopy: string,
}

export type PricingCopy = {
  [SubscriptionProduct]: PriceCopy,
}

const getPricingCopy = (): ?PricingCopy => getGlobal('pricingCopy');

// ----- Export ----- //

export default () => combineReducers({
  pricingCopy: getPricingCopy,
});

