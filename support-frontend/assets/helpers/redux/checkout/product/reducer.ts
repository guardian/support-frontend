import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { WritableDraft } from 'immer/dist/types/types-external';
import { type SelectedAmounts } from 'helpers/contributions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { DateYMDString } from 'helpers/types/DateString';
import { getWeeklyFulfilmentOption } from '../../../productCatalogToFulfilmentOption';
import {
	paperProductsWithDigital,
	paperProductsWithoutDigital,
} from '../../../productCatalogToProductOption';
import { setDeliveryCountry } from '../address/actions';
import { resetValidation, validateForm } from '../checkoutActions';
import { isContribution } from './selectors/productType';
import type { AmountChange, GuardianProduct, ProductState } from './state';
import { initialProductState, otherAmountSchema } from './state';

function validateOtherAmount(state: WritableDraft<ProductState>) {
	if (!isContribution(state.productType)) {
		return;
	}

	if (state.selectedAmounts[state.productType] === 'other') {
		const validationResult = otherAmountSchema.safeParse(
			state.otherAmounts[state.productType],
		);
		if (!validationResult.success) {
			const formattedErrors = validationResult.error.format();
			state.errors = {
				otherAmount: formattedErrors.amount?._errors,
			};
		}
	}
}

export const productSlice = createSlice({
	name: 'product',
	initialState: initialProductState,
	reducers: {
		setProductType(state, action: PayloadAction<GuardianProduct>) {
			state.productType = action.payload;
			state.errors.otherAmount = [];
		},
		setProductOption(state, action: PayloadAction<ProductOptions>) {
			state.productOption = action.payload;
		},
		setAddDigital(state, action: PayloadAction<boolean>) {
			state.productOption = action.payload
				? paperProductsWithDigital[state.productOption]
				: paperProductsWithoutDigital[state.productOption];
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
		setAllAmounts(state, action: PayloadAction<SelectedAmounts>) {
			state.selectedAmounts = action.payload;
		},
		setSelectedAmount(state, action: PayloadAction<AmountChange>) {
			const { contributionType, amount } = action.payload;
			const newAmount = amount === 'other' ? amount : Number.parseFloat(amount);
			state.selectedAmounts[contributionType] = newAmount;
		},
		setOtherAmount(state, action: PayloadAction<AmountChange>) {
			const { contributionType, amount } = action.payload;
			state.otherAmounts[contributionType].amount = amount;
			state.errors.otherAmount = [];
		},
		setCoverTransactionCost(state, action: PayloadAction<boolean>) {
			/* Add 4% to their contribution amount */
			state.coverTransactionCost = action.payload;
		},
		setCurrency(state, action: PayloadAction<IsoCurrency>) {
			state.currency = action.payload;
		},
		setOrderIsAGift(state, action: PayloadAction<boolean>) {
			state.orderIsAGift = action.payload;
		},
		setStartDate(state, action: PayloadAction<DateYMDString>) {
			state.startDate = action.payload;
		},
		setOtherAmountError(state, action: PayloadAction<string>) {
			if (Array.isArray(state.errors.otherAmount)) {
				state.errors.otherAmount.push(action.payload);
			} else {
				state.errors.otherAmount = [action.payload];
			}
		},
		validateOtherAmount,
	},
	extraReducers: (builder) => {
		builder.addCase(setDeliveryCountry, (state, action) => {
			if (state.productType === GuardianWeekly) {
				state.fulfilmentOption = getWeeklyFulfilmentOption(action.payload);
			}
		});

		builder.addCase(validateForm, validateOtherAmount);

		builder.addCase(resetValidation, (state) => {
			state.errors = {};
		});
	},
});

export const productReducer = productSlice.reducer;
