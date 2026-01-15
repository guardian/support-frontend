import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ThankYouMarketingConsentState } from './state';
import { initialThankYouState } from './state';

const thankYou = createSlice({
	name: 'thankYou',
	initialState: initialThankYouState,
	reducers: {
		setThankYouMarketingConsent(
			state,
			action: PayloadAction<ThankYouMarketingConsentState>,
		) {
			state.marketingConsent = action.payload;
		},
	},
});

export const thankYouReducer = thankYou.reducer;
