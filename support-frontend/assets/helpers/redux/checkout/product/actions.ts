import { productSlice } from './reducer';

export const {
	setProductType,
	setProductOption,
	setAddDigital,
	setFulfilmentOption,
	setBillingPeriod,
	setProductPrices,
	setSelectedProductPrice,
	setAllAmounts,
	setSelectedAmount,
	setOtherAmount,
	setCurrency,
	setOrderIsAGift,
	setDiscountedPrice,
} = productSlice.actions;
