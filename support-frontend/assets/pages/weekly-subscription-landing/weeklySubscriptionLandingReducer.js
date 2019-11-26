// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrices, getPromotionCopy } from 'helpers/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type State = {
  common: CommonState,
  page: {
    productPrices: ?ProductPrices,
    promotionCopy: ?PromotionCopy,
    orderIsAGift: boolean,
  }
};

const { orderIsAGift } = window.guardian;

// ----- Export ----- //
export default () => ({
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  orderIsAGift,
});
