// @flow

import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrices, getPromotionCopy } from 'helpers/globalsAndSwitches/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type PaperLandingPropTypes = {|
  productPrices: ?ProductPrices;
  promotionCopy: ?PromotionCopy;
|}

export const paperLandingProps = (): PaperLandingPropTypes => ({
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
});
