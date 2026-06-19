import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';

type ContributionCheckoutParams = {
	product: 'Contribution';
	ratePlan: ProductRatePlanKey<'Contribution'>;
	contribution: number;
};

type SupporterPlusCheckoutParams = {
	product: 'SupporterPlus';
	ratePlan: ProductRatePlanKey<'SupporterPlus'>;
	promoCode?: string;
};

type DigitalSubscriptionCheckoutParams = {
	product: 'DigitalSubscription';
	ratePlan: ProductRatePlanKey<'DigitalSubscription'>;
	promoCode?: string;
};

type CheckoutUrlParams =
	| ContributionCheckoutParams
	| SupporterPlusCheckoutParams
	| DigitalSubscriptionCheckoutParams;

export function buildCheckoutUrl(params: CheckoutUrlParams): string {
	const urlParams = new URLSearchParams({
		product: params.product,
		ratePlan: params.ratePlan,
	});

	if (params.product === 'Contribution') {
		urlParams.set('contribution', params.contribution.toString());
	} else if (params.promoCode) {
		urlParams.set('promoCode', params.promoCode);
	}

	return `checkout?${urlParams.toString()}`;
}
