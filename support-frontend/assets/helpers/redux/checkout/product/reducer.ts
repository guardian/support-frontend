import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SelectedAmounts } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import {
	paperProductsWithDigital,
	paperProductsWithoutDigital,
} from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { DateYMDString } from 'helpers/types/DateString';
import { setDeliveryCountry } from '../address/actions';
import { validateForm } from '../checkoutActions';
import { isContribution } from './selectors/productType';
import type { AmountChange, GuardianProduct } from './state';
import { initialProductState, otherAmountSchema } from './state';

export const productSlice = createSlice({
	name: 'product',
	initialState: initialProductState,
	reducers: {
		setProductType(state, action: PayloadAction<GuardianProduct>) {
			state.productType = action.payload;
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
			const newAmount = amount === 'other' ? amount : Number.parseInt(amount);
			state.selectedAmounts[contributionType] = newAmount;
		},
		setOtherAmount(state, action: PayloadAction<AmountChange>) {
			const { contributionType, amount } = action.payload;
			state.otherAmounts[contributionType].amount = amount;
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
	},
	extraReducers: (builder) => {
		builder.addCase(setDeliveryCountry, (state, action) => {
			if (state.productType === GuardianWeekly) {
				state.fulfilmentOption = getWeeklyFulfilmentOption(action.payload);
			}
		});

		builder.addCase(validateForm, (state) => {
			if (isContribution(state.productType)) {
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
		});
	},
});

export const productReducer = productSlice.reducer;
