// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { getGlobal } from 'helpers/globals';
import type { PromotionTerms } from 'helpers/productPrice/promotions';

export type State = {
  common: CommonState,
  page: {
    promotionTerms: ?PromotionTerms,
  }
};

// ----- Export ----- //
export default () => {
  const terms = getGlobal('promotionTerms');
  return {
    promotionTerms: { ...terms, expires: new Date(terms.expires) },
  };
};
