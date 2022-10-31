import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { createSliceValidatorFor } from 'helpers/redux/utils/validation/errors';
import { validateForm } from '../../checkoutActions';
import { initialSepaState, sepaSchema } from './state';

export const sepaSlice = createSlice({
	name: 'sepa',
	initialState: initialSepaState,
	reducers: {
		setSepaIban(state, action: PayloadAction<string>) {
			state.iban = action.payload;
			delete state.errors.iban;
		},
		setSepaAccountHolderName(state, action: PayloadAction<string>) {
			state.accountHolderName = action.payload;
			delete state.errors.accountHolderName;
		},
		setSepaAddressStreetName(state, action: PayloadAction<string>) {
			state.streetName = action.payload;
			delete state.errors.streetName;
		},
		setSepaAddressCountry(state, action: PayloadAction<string>) {
			state.country = action.payload;
			delete state.errors.country;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			validateForm,
			createSliceValidatorFor(
				sepaSchema,
				(paymentMethod) => paymentMethod === 'Sepa',
			),
		);
	},
});

export const sepaReducer = sepaSlice.reducer;
