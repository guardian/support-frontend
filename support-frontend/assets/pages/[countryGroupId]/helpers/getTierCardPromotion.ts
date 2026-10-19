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
	tierProductKey: TierProductKey,
	billingPeriod: RecurringBillingPeriod,
	tierRatePlanKey: ProductRatePlanKey<TierProductKey>,
): Promotion | undefined {
	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);

	const tierPricing = productCatalog[tierProductKey]?.ratePlans[tierRatePlanKey]
		?.pricing[currencyKey] as number;

	const promotions = window.guardian.promotions ?? [];
	const promoCode = getQueryParameter('promoCode');
	return getLegacyPromotion({
		promotions,
		productKey: tierProductKey,
		ratePlanKey: tierRatePlanKey,
		price: tierPricing,
		billingPeriod: billingPeriod,
		promoCode: promoCode,
	});
}
