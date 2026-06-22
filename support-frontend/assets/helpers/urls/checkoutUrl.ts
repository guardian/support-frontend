import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type {
	ProductKey,
	ProductRatePlanKey,
} from '@modules/product-catalog/productCatalog';

type CheckoutUrlParams<T extends ProductKey> = {
	product: T;
	ratePlan: ProductRatePlanKey<T>;
	promoCode?: string;
	contribution?: number;
};

export function buildCheckoutUrl<T extends ProductKey>(
	supportRegionId: SupportRegionId,
	params: CheckoutUrlParams<T>,
): string {
	const urlParams = new URLSearchParams({
		product: params.product,
		ratePlan: params.ratePlan,
	});

	if (params.contribution) {
		urlParams.set('contribution', params.contribution.toString());
	}

	if (params.promoCode) {
		urlParams.set('promoCode', params.promoCode);
	}

	return `/${supportRegionId}/checkout?${urlParams.toString()}`;
}
