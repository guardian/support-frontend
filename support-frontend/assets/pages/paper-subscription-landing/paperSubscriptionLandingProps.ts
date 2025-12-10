import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { Participations } from 'helpers/abTests/models';
import {
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type PaperLandingPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
	participations: Participations;
	fulfilment?: PaperFulfilmentOptions;
};

export const paperLandingProps = (
	participations: Participations,
): PaperLandingPropTypes => ({
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	participations,
});
