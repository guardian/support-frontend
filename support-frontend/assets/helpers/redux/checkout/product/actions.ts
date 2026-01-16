import { productSlice } from './reducer';

export const {
	setProductType,
	setAllAmounts,
	setSelectedAmount,
	setCurrency,
	setOtherAmountError,
	validateOtherAmount,
} = productSlice.actions;
