import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { StripeAccount } from 'helpers/forms/stripe';
import { initialState } from './state';

export const stripeAccountDetailsSlice = createSlice({
	name: 'stripeAccountDetails',
	initialState,
	reducers: {
		setStripePublicKey(state, action: PayloadAction<string>) {
			state.publicKey = action.payload;
		},
		setStripeAccountName(state, action: PayloadAction<StripeAccount>) {
			state.stripeAccount = action.payload;
		},
	},
});

export const stripeAccountDetailsReducer = stripeAccountDetailsSlice.reducer;
