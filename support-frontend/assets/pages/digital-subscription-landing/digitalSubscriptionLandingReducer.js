// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type State = {
  common: CommonState,
  page: {
    productPrices: ProductPrices,
    promotionCopy: ?PromotionCopy,
    orderIsAGift: boolean,
  }
};

// ----- Export ----- //

export default () => null;
