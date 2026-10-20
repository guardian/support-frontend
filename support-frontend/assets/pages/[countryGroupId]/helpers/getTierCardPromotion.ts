import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import { getLegacyPromotion } from 'helpers/productPrice/legacyPromotion';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getQueryParameter } from 'helpers/urls/url';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import type { TierProductKey } from './getDigitalRatePlanKey';

export function getTierCardPromotion(
	supportRegionId: SupportRegionId,
	productKey: TierProductKey,
	ratePlanKey: ProductRatePlanKey<TierProductKey>,
	billingPeriod: RecurringBillingPeriod,
): Promotion | undefined {
	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);

	const price = productCatalog[productKey]?.ratePlans[ratePlanKey]?.pricing[
		currencyKey
	] as number;

	const promotions = window.guardian.promotions ?? [];
	const promoCode = getQueryParameter('promoCode');
	return getLegacyPromotion({
		promotions,
		productKey,
		ratePlanKey,
		price,
		billingPeriod,
		promoCode,
	});
}
