import { ProductPrices } from 'helpers/productPrice/productPrices';
import {
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { PromotionCopy } from 'helpers/productPrice/promotions';
export type PaperLandingPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
};
export const paperLandingProps = (): PaperLandingPropTypes => ({
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
});
