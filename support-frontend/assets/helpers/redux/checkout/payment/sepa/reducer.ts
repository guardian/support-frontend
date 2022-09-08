import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { getSliceErrorsFromZodResult } from 'helpers/redux/utils/validation/errors';
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
		builder.addCase(validateForm, (state) => {
			const validationResult = sepaSchema.safeParse(state);
			if (!validationResult.success) {
				state.errors = getSliceErrorsFromZodResult(
					validationResult.error.format(),
				);
			}
		});
	},
});

export const sepaReducer = sepaSlice.reducer;
