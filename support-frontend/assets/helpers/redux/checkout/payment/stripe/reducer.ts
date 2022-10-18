import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { StripeErrorPayload } from './state';
import { initialStripeCardState } from './state';
import { getStripeSetupIntent } from './thunks';

export const stripeCardSlice = createSlice({
	name: 'stripeCard',
	initialState: initialStripeCardState,
	reducers: {
		setStripeFieldsCompleted: (state, action: PayloadAction<boolean>) => {
			state.formComplete = action.payload;
		},
		setClientSecret(state, action: PayloadAction<string>) {
			state.setupIntentClientSecret = action.payload;
		},
		setStripePaymentMethod(state, action: PayloadAction<string | undefined>) {
			state.stripePaymentMethod = action.payload;
		},
		setStripeFormError(state, action: PayloadAction<StripeErrorPayload>) {
			state.errors[action.payload.field] = action.payload.errors;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStripeSetupIntent.fulfilled, (state, action) => {
			state.setupIntentClientSecret = action.payload;
		});
	},
});

export const stripeCardReducer = stripeCardSlice.reducer;
