import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { getSliceErrorsFromZodResult } from 'helpers/redux/utils/validation/errors';
import { validateForm } from '../../checkoutActions';
import type { Phase, SortCodeUpdate } from './state';
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
		setSortCode(state, action: PayloadAction<SortCodeUpdate>) {
			const { index, partialSortCode } = action.payload;
			state.sortCodeArray.splice(index, 1, partialSortCode);
		},
		setSortCodeString(state, action: PayloadAction<string>) {
			state.sortCodeString = action.payload;
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

		builder.addCase(validateForm, (state) => {
			const validationResult = directDebitSchema.safeParse(state);

			if (!validationResult.success) {
				state.errors = getSliceErrorsFromZodResult(
					validationResult.error.format(),
				);
			}
		});
	},
});

export const directDebitReducer = directDebitSlice.reducer;
