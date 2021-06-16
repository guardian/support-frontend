// @flow

import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getGlobal, getProductPrices, getPromotionCopy } from 'helpers/globalsAndSwitches/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { detect as detectCountry, type IsoCountry } from 'helpers/internationalisation/country';

export type WeeklyLandingPropTypes = {|
  countryId: IsoCountry;
  productPrices: ?ProductPrices;
  promotionCopy: ?PromotionCopy;
  orderIsAGift: ?boolean;
|}

export const weeklyLandingProps: WeeklyLandingPropTypes = {
  countryId: detectCountry(),
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  orderIsAGift: getGlobal('orderIsAGift'),
};
