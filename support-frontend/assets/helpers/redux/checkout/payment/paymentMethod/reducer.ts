import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { setDeliveryCountry } from '../../address/actions';

export const paymentMethodSlice = createSlice({
	name: 'paymentMethod',
	initialState: 'None' as PaymentMethod,
	reducers: {
		setPaymentMethod(_, action: PayloadAction<PaymentMethod>) {
			return action.payload;
		},
	},
	extraReducers: (builder) => {
		// Not all payment methods are available for all countries, so reset if the delivery country changes
		builder.addCase(setDeliveryCountry, () => {
			return 'None';
		});
	},
});

export const paymentMethodReducer = paymentMethodSlice.reducer;
