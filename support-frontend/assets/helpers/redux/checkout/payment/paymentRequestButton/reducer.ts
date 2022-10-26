import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { StripeAccount } from 'helpers/forms/stripe';
import type { PaymentRequestError } from './state';
import { initialPaymentRequestButtonState } from './state';

export const paymentRequestButtonSlice = createSlice({
	name: 'paymentRequestButton',
	initialState: initialPaymentRequestButtonState,
	reducers: {
		clickPaymentRequestButton(state, action: PayloadAction<StripeAccount>) {
			state[action.payload].buttonClicked = true;
			if (state[action.payload].completed) {
				state[action.payload].completed = false;
			}
		},
		completePaymentRequest(state, action: PayloadAction<StripeAccount>) {
			state[action.payload].completed = true;
		},
		setPaymentRequestError(state, action: PayloadAction<PaymentRequestError>) {
			const { account, error } = action.payload;
			state[account].paymentError = error;
		},
	},
});

export const paymentRequestButtonReducer = paymentRequestButtonSlice.reducer;
