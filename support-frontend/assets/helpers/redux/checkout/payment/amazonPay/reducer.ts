import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
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
		},
	},
});

export const amazonPayReducer = amazonPaySlice.reducer;
