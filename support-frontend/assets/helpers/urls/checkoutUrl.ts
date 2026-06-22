import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type {
	ProductKey,
	ProductRatePlanKey,
} from '@modules/product-catalog/productCatalog';

type ProductUrlParams<T extends ProductKey> = {
	product: T;
	ratePlan: ProductRatePlanKey<T>;
	promoCode?: string;
};

type ContributionUrlParams = ProductUrlParams<'Contribution'> & {
	contribution: number;
};

export function buildCheckoutUrl<T extends ProductKey>(
	supportRegionId: SupportRegionId,
	params: ProductUrlParams<T> | ContributionUrlParams,
): string {
	const urlParams = new URLSearchParams({
		product: params.product,
		ratePlan: params.ratePlan,
	});

	if ('contribution' in params) {
		urlParams.set('contribution', String(params.contribution));
	}

	if (params.promoCode) {
		urlParams.set('promoCode', params.promoCode);
	}

	return `/${supportRegionId}/checkout?${urlParams.toString()}`;
}
