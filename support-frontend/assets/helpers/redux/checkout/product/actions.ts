import { productSlice } from './reducer';

export const {
	setProduct,
	setProductOption,
	setFulfilmentOption,
	setSelectedAmount,
	setOtherAmount,
	setCurrency,
	setIsFixedTerm,
	setSavingVsRetail,
	setPromotions,
	setRedemptionCode,
} = productSlice.actions;
