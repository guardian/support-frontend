import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { AmountChange, GuardianProduct } from './state';
import { initialProductState } from './state';

export const productSlice = createSlice({
	name: 'product',
	initialState: initialProductState,
	reducers: {
		setProduct(state, action: PayloadAction<GuardianProduct>) {
			state.product = action.payload;
		},
		setProductOption(state, action: PayloadAction<ProductOptions>) {
			state.productOption = action.payload;
		},
		setFulfilmentOption(state, action: PayloadAction<FulfilmentOptions>) {
			state.fulfilmentOption = action.payload;
		},
		setSelectedAmount(state, action: PayloadAction<AmountChange>) {
			const { contributionType, amount } = action.payload;
			state.selectedAmounts[contributionType] = amount;
		},
		setOtherAmount(state, action: PayloadAction<AmountChange>) {
			const { contributionType, amount } = action.payload;
			state.otherAmounts[contributionType].amount = amount.toString();
		},
		setCurrency(state, action: PayloadAction<IsoCurrency>) {
			state.currency = action.payload;
		},
		setIsFixedTerm(state, action: PayloadAction<boolean>) {
			state.fixedTerm = action.payload;
		},
		setSavingVsRetail(state, action: PayloadAction<number>) {
			state.savingVsRetail = action.payload;
		},
		setPromotions(state, action: PayloadAction<Promotion[]>) {
			state.promotions = action.payload;
		},
		setRedemptionCode(state, action: PayloadAction<string>) {
			state.redemptionCode = action.payload;
		},
	},
});

export const productReducer = productSlice.reducer;
