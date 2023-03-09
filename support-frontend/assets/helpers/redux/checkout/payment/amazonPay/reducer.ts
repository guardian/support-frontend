import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { validateForm } from '../../checkoutActions';
import { submitForm } from '../../formSubmission/thunks';
import { initialAmazonPayState } from './state';

export const amazonPaySlice = createSlice({
	name: 'amazonPay',
	initialState: initialAmazonPayState,
	reducers: {
		setAmazonPayWalletIsStale(state, action: PayloadAction<boolean>) {
			state.walletIsStale = action.payload;
		},
		setAmazonPayHasAccessToken(state) {
			state.hasAccessToken = true;
		},
		setAmazonPayFatalError(state) {
			state.fatalError = true;
		},
		setAmazonPayPaymentSelected(state, action: PayloadAction<boolean>) {
			state.paymentSelected = action.payload;
			delete state.errors.paymentSelected;
		},
		setAmazonPayOrderReferenceId(state, action: PayloadAction<string>) {
			state.orderReferenceId = action.payload;
		},
		setAmazonPayBillingAgreementId(state, action: PayloadAction<string>) {
			state.amazonBillingAgreementId = action.payload;
		},
		setAmazonPayBillingAgreementConsentStatus(
			state,
			action: PayloadAction<boolean>,
		) {
			state.amazonBillingAgreementConsentStatus = action.payload;
			delete state.errors.consentStatus;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(validateForm, (state, action) => {
			if (action.payload === 'AmazonPay') {
				if (!state.paymentSelected) {
					state.errors.paymentSelected = ['Please proceed with Amazon Pay'];
				}
				if (!state.amazonBillingAgreementConsentStatus) {
					state.errors.consentStatus = [
						'Please tick the box to agree to a recurring payment',
					];
				}
			}
		});

		builder.addCase(submitForm.rejected, (state, action) => {
			const { paymentMethod, errorMessage } = action.meta;
			if (paymentMethod === 'AmazonPay') {
				if (
					errorMessage === 'amazon_pay_try_other_card' ||
					errorMessage === 'amazon_pay_try_again'
				) {
					// Must re-render the wallet widget in order to display amazon's error message
					state.walletIsStale = true;
				} else {
					// Disable Amazon Pay
					state.fatalError = true;
				}
			}
		});
	},
});

export const amazonPayReducer = amazonPaySlice.reducer;
