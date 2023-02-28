import { displayPrice } from 'helpers/productPrice/productPrices';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

export function getSubscriptionPrices(state: ContributionsState) {
	const { countryId } = state.common.internationalisation;
	const { productPrices, fulfilmentOption, productOption } =
		state.page.checkoutForm.product;

	console.log(countryId);

	return {
		monthlyPrice: displayPrice(
			productPrices,
			countryId,
			'Monthly',
			fulfilmentOption,
			productOption,
		),
		annualPrice: displayPrice(
			productPrices,
			countryId,
			'Annual',
			fulfilmentOption,
			productOption,
		),
	};
}
