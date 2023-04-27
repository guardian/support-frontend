import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { FullPaymentMethod } from 'helpers/forms/paymentMethods';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import { setDeliveryCountry } from '../../address/actions';
import { validateForm } from '../../checkoutActions';
import { initialState } from './state';

export const paymentMethodSlice = createSlice({
	name: 'paymentMethod',
	initialState,
	reducers: {
		setPaymentMethod(state, action: PayloadAction<FullPaymentMethod>) {
			state.name = action.payload.paymentMethod;
			state.stripePaymentMethod = action.payload.stripePaymentMethod;
			state.country = undefined;
			state.state = undefined;
			state.errors = [];
		},
		setPaymentMethodCountryAndState(
			state,
			action: PayloadAction<[IsoCountry, StateProvince | undefined]>,
		) {
			state.country = action.payload[0];
			state.state = action.payload[1];
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
