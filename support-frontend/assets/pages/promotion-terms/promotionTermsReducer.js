// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal, getProductPrices } from 'helpers/globals';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';

export type PromotionTermsPropTypes = {
  productPrices: ProductPrices,
  promotionTerms: PromotionTerms,
};

export type State = {
  common: CommonState,
  page: PromotionTermsPropTypes,
};

// ----- Export ----- //
export default () => {
  const productPrices = getProductPrices();
  const terms = getGlobal('promotionTerms');
  const expires = terms && terms.expires ? new Date(terms.expires) : null;
  const starts = terms ? new Date(terms.starts) : null;

  return {
    productPrices,
    promotionTerms: { ...terms, starts, expires },
  };
};
