import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { setDeliveryCountry } from '../../address/actions';
import { validateForm } from '../../checkoutActions';
import { initialState } from './state';

export const paymentMethodSlice = createSlice({
	name: 'paymentMethod',
	initialState,
	reducers: {
		setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
			state.name = action.payload;
			state.errors = [];
		},
	},
	extraReducers: (builder) => {
		// Not all payment methods are available for all countries, so reset if the delivery country changes
		builder.addCase(setDeliveryCountry, (state) => {
			state.name = 'None';
		});

		builder.addCase(validateForm, (state) => {
			if (state.name === 'None') {
				state.errors = ['Please select a payment method'];
			}
		});
	},
});

export const paymentMethodReducer = paymentMethodSlice.reducer;
