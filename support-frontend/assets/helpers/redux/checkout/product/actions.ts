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
	setCurrency,
	setOrderIsAGift,
	setStartDate,
	setOtherAmountError,
	validateOtherAmount,
} = productSlice.actions;
