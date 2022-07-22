import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialSepaState } from './state';

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
});

export const sepaReducer = sepaSlice.reducer;
