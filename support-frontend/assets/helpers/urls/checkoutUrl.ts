import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import type { TierProductKey } from 'pages/[countryGroupId]/helpers/getDigitalRatePlanKey';

type TierProductUrlParams = {
	product: TierProductKey;
	ratePlan: ProductRatePlanKey<TierProductKey>;
	contribution?: number;
	promoCode?: string;
};

export function buildCheckoutUrl(
	supportRegionId: SupportRegionId,
	params: TierProductUrlParams,
): string {
	const urlParams = new URLSearchParams({
		product: params.product,
		ratePlan: params.ratePlan,
	});

	if (params.contribution) {
		urlParams.set('contribution', String(params.contribution));
	}

	if (params.promoCode) {
		urlParams.set('promoCode', params.promoCode);
	}

	return `/${supportRegionId}/checkout?${urlParams.toString()}`;
}
