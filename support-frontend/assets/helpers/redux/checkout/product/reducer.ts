import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
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
		setBillingPeriod(state, action: PayloadAction<BillingPeriod>) {
			state.billingPeriod = action.payload;
		},
		setProductPrices(state, action: PayloadAction<ProductPrices>) {
			state.productPrices = action.payload;
		},
		setSelectedProductPrice(state, action: PayloadAction<ProductPrice>) {
			state.selectedProductPrice = action.payload;
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
		setOrderIsAGift(state, action: PayloadAction<boolean>) {
			state.orderIsAGift = action.payload;
		},
		setDiscountedPrice(state, action: PayloadAction<ProductPrice>) {
			state.discountedProductPrice = action.payload;
		},
		setSavingVsRetail(state, action: PayloadAction<number>) {
			state.savingVsRetail = action.payload;
		},
		setPromotions(state, action: PayloadAction<Promotion[]>) {
			state.promotions = action.payload;
		},
	},
});

export const productReducer = productSlice.reducer;
