import {
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type PaperLandingPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
};
export const paperLandingProps = (): PaperLandingPropTypes => ({
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
});
