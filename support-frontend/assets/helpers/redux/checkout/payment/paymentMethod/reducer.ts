import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';

export const paymentMethodSlice = createSlice({
	name: 'paymentMethod',
	initialState: 'None' as PaymentMethod,
	reducers: {
		setPaymentMethod(_, action: PayloadAction<PaymentMethod>) {
			return action.payload;
		},
	},
});

export const paymentMethodReducer = paymentMethodSlice.reducer;
