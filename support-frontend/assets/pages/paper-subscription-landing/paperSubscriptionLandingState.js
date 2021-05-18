// @flow

import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrices, getPromotionCopy } from 'helpers/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { detect as detectCountry, type IsoCountry } from 'helpers/internationalisation/country';

export const countryId: IsoCountry = detectCountry();
export const productPrices: ?ProductPrices = getProductPrices();
export const promotionCopy: ?PromotionCopy = getPromotionCopy();
