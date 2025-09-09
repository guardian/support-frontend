import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type {
	CountryGroupPrices,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { ActivePaperProductTypes } from '../productCatalogToProductOption';

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
