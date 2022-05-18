import { Monthly } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import type {
	CountryGroupPrices,
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getProductPrice as genericGetProductPrice } from 'helpers/productPrice/productPrices';
import {
	applyDiscount,
	getAppliedPromo,
} from 'helpers/productPrice/promotions';

const country = 'GB';
const billingPeriod = Monthly;

function getProductPrice(
	productPrices: ProductPrices,
	fulfilmentOption?: FulfilmentOptions,
	productOption?: ProductOptions,
): ProductPrice {
	return genericGetProductPrice(
		productPrices,
		country,
		billingPeriod,
		fulfilmentOption,
		productOption,
	);
}

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

function getPriceWithDiscount(
	productPrices: ProductPrices,
	fulfilmentOption: FulfilmentOptions,
	productOption: ProductOptions,
): ProductPrice {
	const basePrice = getProductPrice(
		productPrices,
		fulfilmentOption,
		productOption,
	);

	return applyDiscount(basePrice, getAppliedPromo(basePrice.promotions));
}

export { getProductPrice, getMaxSavingVsRetail, getPriceWithDiscount };
