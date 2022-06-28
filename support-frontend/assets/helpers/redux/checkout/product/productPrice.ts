import type { ProductPrice } from 'helpers/productPrice/productPrices';
import {
	finalPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { ProductState } from './state';

const requiredFieldsForProduct = {
	Paper: (productState: ProductState) => {
		const hasFulfilment =
			productState.fulfilmentOption !== 'NoFulfilmentOptions';
		const hasProductOption = productState.productOption !== 'NoProductOptions';
		return hasFulfilment && hasProductOption;
	},
};

export function selectProductPrice(
	state: SubscriptionsState,
): ProductPrice | undefined {
	const { common, page } = state;
	const { product } = page.checkoutForm;
	if (
		product.productType !== 'NoProduct' &&
		requiredFieldsForProduct.Paper(product)
	) {
		const selectedProductPrice = getProductPrice(
			product.productPrices,
			common.internationalisation.countryId,
			product.billingPeriod,
			product.fulfilmentOption,
			product.productOption,
		);
		return selectedProductPrice;
	}
}

export function selectDiscountedPrice(
	state: SubscriptionsState,
): ProductPrice | undefined {
	const { common, page } = state;
	const { product } = page.checkoutForm;
	if (product.productType !== 'NoProduct') {
		return finalPrice(
			product.productPrices,
			common.internationalisation.countryId,
			product.billingPeriod,
		);
	}
}
