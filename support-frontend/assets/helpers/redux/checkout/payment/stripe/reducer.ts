import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { validateForm } from '../../checkoutActions';
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
			if (action.payload.error) {
				state.errors[action.payload.field] = [action.payload.error];
			} else {
				delete state.errors[action.payload.field];
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStripeSetupIntent.fulfilled, (state, action) => {
			state.setupIntentClientSecret = action.payload;
		});

		builder.addCase(validateForm, (state, action) => {
			if (action.payload === 'Stripe') {
				state.showErrors = true;
			}
		});
	},
});

export const stripeCardReducer = stripeCardSlice.reducer;
