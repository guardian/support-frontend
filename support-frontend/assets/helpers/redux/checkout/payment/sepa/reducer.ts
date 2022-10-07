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
		},
		setSepaAccountHolderName(state, action: PayloadAction<string>) {
			state.accountHolderName = action.payload;
		},
		setSepaAddressStreetName(state, action: PayloadAction<string>) {
			state.streetName = action.payload;
		},
		setSepaAddressCountry(state, action: PayloadAction<string>) {
			state.country = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(validateForm, createSliceValidatorFor(sepaSchema));
	},
});

export const sepaReducer = sepaSlice.reducer;
