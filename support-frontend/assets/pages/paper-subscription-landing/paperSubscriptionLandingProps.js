// @flow

import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrices, getPromotionCopy, getSettings } from 'helpers/globalsAndSwitches/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { detect } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';

export type PaperLandingPropTypes = {|
  productPrices: ?ProductPrices;
  promotionCopy: ?PromotionCopy;
  participations: Participations;
|}

export const paperLandingProps = (): PaperLandingPropTypes => ({
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  participations: initAbTests(detect(GBPCountries), GBPCountries, getSettings()),
});
