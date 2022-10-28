import { productSlice } from './reducer';

export const {
	setProductType,
	setProductOption,
	setAddDigital,
	setFulfilmentOption,
	setBillingPeriod,
	setProductPrices,
	setAllAmounts,
	setSelectedAmount,
	setOtherAmount,
	setCurrency,
	setOrderIsAGift,
	setStartDate,
	setOtherAmountError,
} = productSlice.actions;
