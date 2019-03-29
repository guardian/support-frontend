// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import promotionPopUpReducer, { type FindOutMoreState } from './components/promotionPopUpReducer';
import { getProductPrices } from 'helpers/globals';

export type State = {
  common: CommonState,
  page: {
    productPrices: ProductPrices,
    promotion: FindOutMoreState
  }
};


// ----- Export ----- //

export default () => combineReducers({
  productPrices: getProductPrices,
  promotion: promotionPopUpReducer,
});
