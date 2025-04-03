import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { StripeAccountType } from 'helpers/forms/stripe';
import { resetValidation, validateForm } from '../../checkoutActions';
import type { PaymentRequestError } from './state';
import { initialPaymentRequestButtonState } from './state';

export const paymentRequestButtonSlice = createSlice({
	name: 'paymentRequestButton',
	initialState: initialPaymentRequestButtonState,
	reducers: {
		clickPaymentRequestButton(state, action: PayloadAction<StripeAccountType>) {
			state[action.payload].buttonClicked = true;
			if (state[action.payload].completed) {
				state[action.payload].completed = false;
			}
		},
		unClickPaymentRequestButton(
			state,
			action: PayloadAction<StripeAccountType>,
		) {
			state[action.payload].buttonClicked = false;
		},
		completePaymentRequest(state, action: PayloadAction<StripeAccountType>) {
			state[action.payload].completed = true;
		},
		setPaymentRequestError(state, action: PayloadAction<PaymentRequestError>) {
			const { account, error } = action.payload;
			state[account].paymentError = error;
		},
	},
	extraReducers: (builder) => {
		// If we're validating again after the PRB is in a completed state, it's because the PRB payment failed
		// and the user is paying by some other method. Thus we need to reset in order to display regular validation errors
		builder.addCase(validateForm, (state) => {
			if (state.ONE_OFF.completed) {
				state.ONE_OFF.buttonClicked = false;
				state.ONE_OFF.completed = false;
				delete state.ONE_OFF.paymentError;
			}
			if (state.REGULAR.completed) {
				state.REGULAR.buttonClicked = false;
				state.REGULAR.completed = false;
				delete state.REGULAR.paymentError;
			}
		});

		builder.addCase(resetValidation, (state) => {
			delete state.ONE_OFF.paymentError;
			delete state.REGULAR.paymentError;
		});
	},
});

export const paymentRequestButtonReducer = paymentRequestButtonSlice.reducer;
