import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { createSliceValidatorFor } from 'helpers/redux/utils/validation/errors';
import { resetValidation, validateForm } from '../../checkoutActions';
import type { Phase } from './state';
import { directDebitSchema, initialDirectDebitState } from './state';
import {
	confirmAccountDetails,
	directDebitErrorMessages,
	payWithDirectDebit,
} from './thunks';

export const directDebitSlice = createSlice({
	name: 'directDebit',
	initialState: initialDirectDebitState,
	reducers: {
		setPopupOpen(state) {
			state.isPopUpOpen = true;
		},
		setPopupClose(state) {
			state.isPopUpOpen = false;
		},
		setDDGuaranteeOpen(state) {
			state.isDDGuaranteeOpen = true;
		},
		setDDGuaranteeClose(state) {
			state.isDDGuaranteeOpen = false;
		},
		setSortCode(state, action: PayloadAction<string>) {
			state.sortCode = action.payload;
		},
		setAccountNumber(state, action: PayloadAction<string>) {
			state.accountNumber = action.payload;
		},
		setAccountHolderName(state, action: PayloadAction<string>) {
			state.accountHolderName = action.payload;
		},
		setAccountHolderConfirmation(state, action: PayloadAction<boolean>) {
			state.accountHolderConfirmation = action.payload;
		},
		setFormError(state, action: PayloadAction<string>) {
			state.formError = action.payload;
		},
		resetFormError(state) {
			state.formError = '';
		},
		setPhase(state, action: PayloadAction<Phase>) {
			state.phase = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(confirmAccountDetails.pending, (state) => {
			state.formError = '';
		});

		builder.addCase(confirmAccountDetails.fulfilled, (state, action) => {
			if (action.payload) {
				state.phase = 'confirmation';
			} else {
				state.formError = directDebitErrorMessages.incorrectInput;
			}
		});

		builder.addCase(confirmAccountDetails.rejected, (state, action) => {
			const errorMessage =
				action.error.message ?? directDebitErrorMessages.default;
			state.formError = errorMessage;
		});

		builder.addCase(payWithDirectDebit.fulfilled, (state) => {
			state.isPopUpOpen = false;
		});

		builder.addCase(payWithDirectDebit.rejected, (state) => {
			state.isPopUpOpen = false;
		});

		builder.addCase(
			validateForm,
			createSliceValidatorFor(
				directDebitSchema,
				(paymentMethod) => paymentMethod === 'DirectDebit',
			),
		);

		builder.addCase(resetValidation, (state) => {
			state.errors = {};
		});
	},
});

export const directDebitReducer = directDebitSlice.reducer;
