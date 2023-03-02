import { finalPrice, showPrice } from 'helpers/productPrice/productPrices';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

export function getSubscriptionPrices(
	state: ContributionsState,
): Record<'monthlyPrice' | 'annualPrice', string> {
	const { countryId } = state.common.internationalisation;
	const { productPrices, fulfilmentOption, productOption } =
		state.page.checkoutForm.product;

	return {
		monthlyPrice: showPrice(
			finalPrice(
				productPrices,
				countryId,
				'Monthly',
				fulfilmentOption,
				productOption,
			),
		),
		annualPrice: showPrice(
			finalPrice(
				productPrices,
				countryId,
				'Annual',
				fulfilmentOption,
				productOption,
			),
		),
	};
}

export function getSubscriptionPriceForBillingPeriod(
	state: ContributionsState,
): string {
	const { countryId } = state.common.internationalisation;
	const { productPrices, fulfilmentOption, productOption, billingPeriod } =
		state.page.checkoutForm.product;

	return showPrice(
		finalPrice(
			productPrices,
			countryId,
			billingPeriod,
			fulfilmentOption,
			productOption,
		),
	);
}
