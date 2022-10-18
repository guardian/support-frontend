import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { initialState } from './state';

export const recaptchaSlice = createSlice({
	name: 'recaptcha',
	initialState,
	reducers: {
		setRecaptchaToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			state.completed = true;
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
	},
});

export const recaptchaReducer = recaptchaSlice.reducer;
