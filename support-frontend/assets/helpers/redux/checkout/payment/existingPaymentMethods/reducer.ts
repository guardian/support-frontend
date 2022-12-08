import { createSlice } from '@reduxjs/toolkit';
import { Completed, Failed, Pending } from 'helpers/types/asyncStatus';
import { logException } from 'helpers/utilities/logger';
import { initialState } from './state';
import { getExistingPaymentMethods } from './thunks';
import { getExistingPaymentMethodSwitchState } from './utils';

export const existingPaymentMethodsSlice = createSlice({
	name: 'existingPaymentMethods',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getExistingPaymentMethods.pending, (state) => {
			state.status = Pending;
		});

		builder.addCase(getExistingPaymentMethods.rejected, (state, action) => {
			logException(
				'Failed to get existing payment options',
				action.error as Record<string, unknown>,
			);
			state.status = Failed;
		});

		builder.addCase(getExistingPaymentMethods.fulfilled, (state, action) => {
			const switchState = getExistingPaymentMethodSwitchState();

			const switchedOnExistingPaymentMethods = action.payload.filter(
				({ paymentType }) =>
					(paymentType === 'Card' && switchState.card) ||
					(paymentType === 'DirectDebit' && switchState.directDebit),
			);
			state.existingPaymentMethods = switchedOnExistingPaymentMethods;
			state.status = Completed;
		});
	},
});
