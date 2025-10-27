import { productSlice } from './reducer';

export const {
	setProductType,
	setProductOption,
	setAddDigital,
	setFulfilmentOption,
	setBillingPeriod,
	setAllAmounts,
	setSelectedAmount,
	setCurrency,
	setOrderIsAGift,
	setStartDate,
	setOtherAmountError,
	validateOtherAmount,
} = productSlice.actions;
