import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
	ThankYouMarketingConsentState,
	ThankYouSupportReminderState,
} from './state';
import { initialThankYouState } from './state';

export const thankYou = createSlice({
	name: 'thankYou',
	initialState: initialThankYouState,
	reducers: {
		setThankYouFeedbackSurveyHasBeenCompleted(
			state,
			action: PayloadAction<boolean>,
		) {
			state.feedbackSurveyHasBeenCompleted = action.payload;
		},
		setThankYouMarketingConsent(
			state,
			action: PayloadAction<ThankYouMarketingConsentState>,
		) {
			state.marketingConsent = action.payload;
		},
		setThankYouSupportReminder(
			state,
			action: PayloadAction<ThankYouSupportReminderState>,
		) {
			state.supportReminder = action.payload;
		},
	},
});

export const thankYouReducer = thankYou.reducer;
