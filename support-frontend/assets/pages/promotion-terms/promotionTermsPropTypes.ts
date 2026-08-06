import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionTerms } from 'helpers/productPrice/promotions';

export type PromotionTermsPropTypes = {
	productPrices: ProductPrices;
	promotionTerms: PromotionTerms;
	supportRegionId: SupportRegionId;
};
