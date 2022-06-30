import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { correspondingPaperProducts } from 'helpers/productPrice/productOptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import {
	finalPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import { paperProductTypes } from 'helpers/productPrice/subscriptions';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { GuardianProduct, ProductState } from '../state';

function canDeterminePaperPrice(productState: ProductState): boolean {
	const hasFulfilment = productState.fulfilmentOption !== 'NoFulfilmentOptions';
	const hasProductOption = productState.productOption !== 'NoProductOptions';
	return hasFulfilment && hasProductOption;
}

const requiredFieldsForProduct: Record<
	GuardianProduct,
	(productState: ProductState) => boolean
> = {
	DigitalPack: () => true,
	GuardianWeekly: (productState: ProductState) =>
		productState.fulfilmentOption !== 'NoFulfilmentOptions',
	Paper: canDeterminePaperPrice,
	PaperAndDigital: canDeterminePaperPrice,
	NoProduct: () => false,
	DailyEdition: () => false,
	PremiumTier: () => false,
	ONE_OFF: () => false,
	MONTHLY: () => false,
	ANNUAL: () => false,
};

const getDefaultPriceObject = (currency: IsoCurrency): ProductPrice => ({
	price: 0,
	currency,
	fixedTerm: false,
});

export function selectPriceForProduct(state: SubscriptionsState): ProductPrice {
	const { common, page } = state;
	const { product } = page.checkoutForm;
	if (requiredFieldsForProduct[product.productType](product)) {
		const selectedProductPrice = getProductPrice(
			product.productPrices,
			common.internationalisation.countryId,
			product.billingPeriod,
			product.fulfilmentOption,
			product.productOption,
		);
		return selectedProductPrice;
	}
	return getDefaultPriceObject(common.internationalisation.currencyId);
}

export function selectDiscountedPrice(state: SubscriptionsState): ProductPrice {
	const { common, page } = state;
	const { product } = page.checkoutForm;
	if (requiredFieldsForProduct[product.productType](product)) {
		return finalPrice(
			product.productPrices,
			common.internationalisation.countryId,
			product.billingPeriod,
			product.fulfilmentOption,
			product.productOption,
		);
	}
	return getDefaultPriceObject(common.internationalisation.currencyId);
}

function isPaperProduct(productType: GuardianProduct): boolean {
	return paperProductTypes.includes(productType);
}

// This is to support showing users the price of adding or removing the digital pack
// from their paper subscription selection
export function selectCorrespondingProductOptionPrice(
	state: SubscriptionsState,
): ProductPrice {
	const { common, page } = state;
	const { product } = page.checkoutForm;
	if (
		isPaperProduct(product.productType) &&
		requiredFieldsForProduct[product.productType](product)
	) {
		const correspondingProductOption =
			correspondingPaperProducts[product.productOption];
		return finalPrice(
			product.productPrices,
			common.internationalisation.countryId,
			product.billingPeriod,
			product.fulfilmentOption,
			correspondingProductOption,
		);
	}
	return selectDiscountedPrice(state);
}
