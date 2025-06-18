import type { FulfilmentOptions } from '@modules/productCatalog/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from '@modules/productCatalog/fulfilmentOptions';
import { ActivePaperProductTypes } from '@modules/productCatalog/productOptions';
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

	return;
}

export { getMaxSavingVsRetail };
