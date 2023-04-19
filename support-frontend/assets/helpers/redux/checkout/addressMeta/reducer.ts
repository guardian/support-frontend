import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';

export const addressMetaSlice = createSlice({
	name: 'addressMeta',
	initialState,
	reducers: {
		setIsBillingAddressSame(state, action: PayloadAction<boolean>) {
			state.billingAddressIsSame = action.payload;
		},
		setDeliveryInstructions(state, action: PayloadAction<string>) {
			state.deliveryInstructions = action.payload;
		},
	},
});

export const addressMetaReducer = addressMetaSlice.reducer;
