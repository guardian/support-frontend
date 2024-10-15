import { getProductPrice, showPrice } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	finalPrice,
	getAppliedPromo,
	getPromotion,
} from 'helpers/productPrice/promotions';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { isSupporterPlusFromState } from './isSupporterPlus';

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
			false,
		),
		annualPrice: showPrice(
			finalPrice(
				productPrices,
				countryId,
				'Annual',
				fulfilmentOption,
				productOption,
			),
			false,
		),
	};
}

export function getSubscriptionPricesBeforeDiscount(
	state: ContributionsState,
): Record<'monthlyPrice' | 'annualPrice', string> {
	const { countryId } = state.common.internationalisation;
	const { productPrices, fulfilmentOption, productOption } =
		state.page.checkoutForm.product;

	return {
		monthlyPrice: showPrice(
			getProductPrice(
				productPrices,
				countryId,
				'Monthly',
				fulfilmentOption,
				productOption,
			),
			false,
		),
		annualPrice: showPrice(
			getProductPrice(
				productPrices,
				countryId,
				'Annual',
				fulfilmentOption,
				productOption,
			),
			false,
		),
	};
}

export function getSubscriptionPromotions(
	state: ContributionsState,
): Partial<Record<'monthlyPrice' | 'annualPrice', Promotion>> {
	const { countryId } = state.common.internationalisation;
	const { productPrices, fulfilmentOption, productOption } =
		state.page.checkoutForm.product;

	return {
		monthlyPrice: getPromotion(
			productPrices,
			countryId,
			'Monthly',
			fulfilmentOption,
			productOption,
		),
		annualPrice: getPromotion(
			productPrices,
			countryId,
			'Annual',
			fulfilmentOption,
			productOption,
		),
	};
}

export function getSubscriptionPromotionForBillingPeriod(
	state: ContributionsState,
): Promotion | undefined {
	const { countryId } = state.common.internationalisation;
	const {
		productPrices,
		fulfilmentOption,
		productOption,
		billingPeriod,
		productType,
	} = state.page.checkoutForm.product;

	if (productType === 'DigitalPack' || isSupporterPlusFromState(state)) {
		return getAppliedPromo(
			getProductPrice(
				productPrices,
				countryId,
				billingPeriod,
				fulfilmentOption,
				productOption,
			).promotions,
		);
	}

	return;
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
		false,
	);
}
