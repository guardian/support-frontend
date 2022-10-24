import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { StripeAccount } from 'helpers/forms/stripe';
import { initialStripeAccountDetailsState } from './state';

export const stripeAccountDetailsSlice = createSlice({
	name: 'stripeAccountDetails',
	initialState: initialStripeAccountDetailsState,
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
