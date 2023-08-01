import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';

export const addressMetaSlice = createSlice({
	name: 'addressMeta',
	initialState,
	reducers: {
		setBillingAddressMatchesDelivery(state, action: PayloadAction<boolean>) {
			state.billingAddressMatchesDelivery = action.payload;
		},
		setDeliveryInstructions(state, action: PayloadAction<string>) {
			state.deliveryInstructions = action.payload;
		},
		setDeliveryAgent(state, action: PayloadAction<number>) {
			state.deliveryAgent = action.payload;
		},
	},
});

export const addressMetaReducer = addressMetaSlice.reducer;
