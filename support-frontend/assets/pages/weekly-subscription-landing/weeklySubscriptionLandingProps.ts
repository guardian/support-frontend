import type { ProductPrices } from "helpers/productPrice/productPrices";
import { getGlobal, getProductPrices, getPromotionCopy } from "helpers/globalsAndSwitches/globals";
import type { PromotionCopy } from "helpers/productPrice/promotions";
import type { IsoCountry } from "helpers/internationalisation/country";
import { detect as detectCountry } from "helpers/internationalisation/country";
export type WeeklyLandingPropTypes = {
  countryId: IsoCountry;
  productPrices: ProductPrices | null | undefined;
  promotionCopy: PromotionCopy | null | undefined;
  orderIsAGift: boolean | null | undefined;
};
export const weeklyLandingProps = (): WeeklyLandingPropTypes => ({
  countryId: detectCountry(),
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  orderIsAGift: getGlobal('orderIsAGift')
});