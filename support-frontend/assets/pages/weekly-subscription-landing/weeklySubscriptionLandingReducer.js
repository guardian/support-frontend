// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrices } from 'helpers/globals';

export type State = {
  common: CommonState,
  page: {
    productPrices: ?ProductPrices,
  }
};

// ----- Export ----- //
export default () => ({
  productPrices: getProductPrices(),
});
