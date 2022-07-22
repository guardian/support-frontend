import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import type {
	CountryGroupPrices,
	ProductPrices,
} from 'helpers/productPrice/productPrices';

function getSavingsForFulfilmentOption(
	prices: CountryGroupPrices,
	fulfilmentOption: FulfilmentOptions,
) {
	return ActivePaperProductTypes.map((productOption) => {
		const price = prices[fulfilmentOption]?.[productOption]?.Monthly?.GBP;
		return price?.savingVsRetail ?? 0;
	});
}

function getMaxSavingVsRetail(
	productPrices: ProductPrices,
): number | undefined {
	const countryPrices = productPrices['United Kingdom'];

	if (countryPrices) {
		const allSavings = getSavingsForFulfilmentOption(
			countryPrices,
			Collection,
		).concat(getSavingsForFulfilmentOption(countryPrices, HomeDelivery));

		return Math.max(...allSavings);
	}
}

export { getMaxSavingVsRetail };
