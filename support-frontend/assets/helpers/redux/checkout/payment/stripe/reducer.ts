import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialStripeCardState } from './state';
import { getStripeSetupIntent } from './thunks';

export const stripeCardSlice = createSlice({
	name: 'stripeCard',
	initialState: initialStripeCardState,
	reducers: {
		setFormComplete: (state, action: PayloadAction<boolean>) => {
			state.formComplete = action.payload;
		},
		setClientSecret(state, action: PayloadAction<string>) {
			state.setupIntentClientSecret = action.payload;
		},
		setStripePaymentMethod(state, action: PayloadAction<string>) {
			state.stripePaymentMethod = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStripeSetupIntent.fulfilled, (state, action) => {
			state.setupIntentClientSecret = action.payload;
		});
	},
});

export const stripeCardReducer = stripeCardSlice.reducer;
