import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialMarketingConsentState } from './state';

export const marketingConsentSlice = createSlice({
	name: 'marketingConsent',
	initialState: initialMarketingConsentState,
	reducers: {
		setApiError(state, action: PayloadAction<boolean>) {
			state.error = action.payload;
		},
		setConfirmMarketingConsent(state, action: PayloadAction<boolean>) {
			state.confirmOptIn = action.payload;
		},
		setRequestPending(state, action: PayloadAction<boolean>) {
			state.requestPending = action.payload;
		},
	},
});

export const marketingConsentReducer = marketingConsentSlice.reducer;
