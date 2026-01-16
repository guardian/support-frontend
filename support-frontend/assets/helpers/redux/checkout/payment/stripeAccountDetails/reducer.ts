import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { StripeAccountType } from 'helpers/forms/stripe';
import { initialState } from './state';

const stripeAccountDetailsSlice = createSlice({
	name: 'stripeAccountDetails',
	initialState,
	reducers: {
		setStripePublicKey(state, action: PayloadAction<string>) {
			state.publicKey = action.payload;
		},
		setStripeAccountName(state, action: PayloadAction<StripeAccountType>) {
			state.stripeAccount = action.payload;
		},
	},
});

export const stripeAccountDetailsReducer = stripeAccountDetailsSlice.reducer;
