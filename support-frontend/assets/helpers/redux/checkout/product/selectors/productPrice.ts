import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import { finalPrice } from 'helpers/productPrice/promotions';
import { paperProductTypes } from 'helpers/productPrice/subscriptions';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { renderError } from 'helpers/rendering/render';
import { productOptionIfDigiAddOnChanged } from '../../../../productCatalogToProductOption';
import type { GuardianProduct, ProductState } from '../state';

function canDeterminePaperPrice(productState: ProductState): boolean {
	const hasFulfilment = productState.fulfilmentOption !== 'NoFulfilmentOptions';
	const hasProductOption = productState.productOption !== 'NoProductOptions';
	return hasFulfilment && hasProductOption;
}
function canDetermineGuardianWeeklyFulfilment(
	productState: ProductState,
): boolean {
	return productState.fulfilmentOption !== 'NoFulfilmentOptions';
}

const requiredFieldsForProduct: Record<
	GuardianProduct,
	(productState: ProductState) => boolean
> = {
	DigitalPack: () => true,
	GuardianWeekly: canDetermineGuardianWeeklyFulfilment,
	GuardianWeeklyGift: canDetermineGuardianWeeklyFulfilment,
	Paper: canDeterminePaperPrice,
	PaperAndDigital: canDeterminePaperPrice,
	NoProduct: () => false,
	DailyEdition: () => false,
	PremiumTier: () => false,
	ONE_OFF: () => false,
	MONTHLY: () => false,
	ANNUAL: () => false,
};

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
	throw renderError(new Error('Could not determine product price'));
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
	// Throwing so we unwind the stack
	throw renderError(new Error('Could not determine discounted product price'));
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
		const alternateProductOption = productOptionIfDigiAddOnChanged(
			product.productOption,
		);
		return finalPrice(
			product.productPrices,
			common.internationalisation.countryId,
			product.billingPeriod,
			product.fulfilmentOption,
			alternateProductOption,
		);
	}
	return selectDiscountedPrice(state);
}
