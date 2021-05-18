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
import { init as initAbTests, type Participations } from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globals';

export type DigitalLandingPropTypes = {|
  countryId: IsoCountry;
  countryGroupId: CountryGroupId;
  currencyId: IsoCurrency;
  participations: Participations;
  productPrices: ?ProductPrices;
  promotionCopy: ?PromotionCopy;
  orderIsAGift: ?boolean;
|}

const countryGroupId = detectCountryGroup();
const countryId = detectCountry();

export const digitalLandingProps: DigitalLandingPropTypes = {
  countryId,
  countryGroupId,
  currencyId: detectCurrency(countryGroupId),
  participations: initAbTests(countryId, countryGroupId, getSettings()),
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  orderIsAGift: getGlobal('orderIsAGift'),
};
