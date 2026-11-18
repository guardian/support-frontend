import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { getAppliedPromotion } from 'helpers/productPrice/appliedPromotion';
import { getQueryParameter } from 'helpers/urls/url';
import type { TierProductKey } from './getDigitalRatePlanKey';

type GetTierCardPromotionParams = {
	productKey: TierProductKey;
	ratePlanKey: ProductRatePlanKey<TierProductKey>;
};

export function getTierCardPromotion({
	productKey,
	ratePlanKey,
}: GetTierCardPromotionParams): PromoWithCatalogInformation | undefined {
	return getAppliedPromotion(
		window.guardian.promotions ?? [],
		productKey,
		ratePlanKey,
		getQueryParameter('promoCode'),
	);
}
