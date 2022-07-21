import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { initialPayPalState } from './state';

export const loadPayPalExpressSdk = createAsyncThunk(
	'paypal/loadPayPalExpressSdk',
	loadPayPalRecurring,
);

export const payPalSlice = createSlice({
	name: 'paypal',
	initialState: initialPayPalState,
	reducers: {
		updatePayPalButtonReady(state, action: PayloadAction<boolean>) {
			state.buttonReady = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loadPayPalExpressSdk.pending, (state) => {
			state.hasBegunLoading = true;
		});
		builder.addCase(loadPayPalExpressSdk.fulfilled, (state) => {
			state.hasLoaded = true;
		});
	},
});

export const payPalReducer = payPalSlice.reducer;
