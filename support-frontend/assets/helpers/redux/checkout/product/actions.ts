import { productSlice } from './reducer';

export const {
	setProduct,
	setProductOption,
	setFulfilmentOption,
	setBillingPeriod,
	setProductPrices,
	setSelectedProductPrice,
	setSelectedAmount,
	setOtherAmount,
	setCurrency,
	setOrderIsAGift,
	setDiscountedPrice,
	setSavingVsRetail,
	setPromotions,
} = productSlice.actions;
