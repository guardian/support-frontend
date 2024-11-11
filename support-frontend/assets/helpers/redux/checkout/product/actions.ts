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
	setCoverTransactionCost,
	setOtherAmount,
	setCurrency,
	setOrderIsAGift,
	setStartDate,
	setOtherAmountError,
	validateOtherAmount,
} = productSlice.actions;
