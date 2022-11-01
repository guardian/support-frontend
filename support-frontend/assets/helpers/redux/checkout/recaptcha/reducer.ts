import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { validateForm } from '../checkoutActions';
import { initialState } from './state';

export const recaptchaSlice = createSlice({
	name: 'recaptcha',
	initialState,
	reducers: {
		setRecaptchaToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			state.completed = true;
			state.errors = [];
		},
		expireRecaptchaToken(state) {
			state.token = '';
			state.completed = false;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(setPaymentMethod, (state) => {
			state.token = '';
			state.completed = false;
		});

		builder.addCase(validateForm, (state) => {
			if (!state.completed) {
				state.errors = ["Please check the 'I'm not a robot' checkbox"];
			}
		});
	},
});

export const recaptchaReducer = recaptchaSlice.reducer;
