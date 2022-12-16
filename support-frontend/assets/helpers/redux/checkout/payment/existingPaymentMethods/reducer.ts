import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Completed, Failed, Pending } from 'helpers/types/asyncStatus';
import { logException } from 'helpers/utilities/logger';
import { setProductType } from '../../product/actions';
import type { RecentlySignedInExistingPaymentMethod } from './state';
import { initialState } from './state';
import { getExistingPaymentMethods } from './thunks';
import { getUsableExistingPaymentMethods } from './utils';

export const existingPaymentMethodsSlice = createSlice({
	name: 'existingPaymentMethods',
	initialState,
	reducers: {
		selectExistingPaymentMethod(
			state,
			action: PayloadAction<RecentlySignedInExistingPaymentMethod>,
		) {
			state.selectedPaymentMethod = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(setProductType, (state, action) => {
			if (action.payload === 'ONE_OFF') {
				state.showExistingPaymentMethods = false;
			} else {
				state.showExistingPaymentMethods = true;
			}
		});

		builder.addCase(getExistingPaymentMethods.pending, (state) => {
			state.status = Pending;
		});

		builder.addCase(getExistingPaymentMethods.rejected, (state, action) => {
			logException(
				'Failed to get existing payment options',
				action.error as Record<string, unknown>,
			);
			state.status = Failed;
		});

		builder.addCase(getExistingPaymentMethods.fulfilled, (state, action) => {
			const usablePaymentMethods = getUsableExistingPaymentMethods(
				action.payload,
			);
			state.paymentMethods = usablePaymentMethods;
			state.status = Completed;

			// The user has at least one existing payment method, but it's not currently usable for payment
			if (usablePaymentMethods.length < action.payload.length) {
				state.showReauthenticateLink = true;
			}
		});
	},
});

export const existingPaymentMethodsReducer =
	existingPaymentMethodsSlice.reducer;
