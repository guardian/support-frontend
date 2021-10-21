import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type WeeklyLandingPropTypes = {
	countryId: IsoCountry;
	productPrices?: ProductPrices;
	promotionCopy?: PromotionCopy;
	orderIsAGift?: boolean;
};
export const weeklyLandingProps = (): WeeklyLandingPropTypes => ({
	countryId: detectCountry(),
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	orderIsAGift: getGlobal('orderIsAGift'),
});
