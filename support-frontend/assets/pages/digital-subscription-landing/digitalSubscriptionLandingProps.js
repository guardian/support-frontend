// @flow

import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getGlobal, getProductPrices, getPromotionCopy } from 'helpers/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import {
  detect as detectCountryGroup,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { detect as detectCountry, type IsoCountry } from 'helpers/internationalisation/country';
import {
  detect as detectCurrency,
  type IsoCurrency,
} from 'helpers/internationalisation/currency';

export type DigitalLandingPropTypes = {|
  countryId: IsoCountry;
  countryGroupId: CountryGroupId;
  currencyId: IsoCurrency;
  productPrices: ?ProductPrices;
  promotionCopy: ?PromotionCopy;
  orderIsAGift: ?boolean;
|}

const countryGroupId = detectCountryGroup();

export const digitalLandingProps: DigitalLandingPropTypes = {
  countryId: detectCountry(),
  countryGroupId,
  currencyId: detectCurrency(countryGroupId),
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  orderIsAGift: getGlobal('orderIsAGift'),
};
