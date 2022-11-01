export interface ThankYouMarketingConsentState {
	hasBeenCompleted: boolean;
	hasConsented: boolean;
	errorMessage: string | null;
}

export interface ThankYouSupportReminderState {
	selectedChoiceIndex: number;
	hasBeenCompleted: boolean;
	errorMessage: string | null;
}

export type ThankYouState = {
	feedbackSurveyHasBeenCompleted: boolean;
	marketingConsent: ThankYouMarketingConsentState;
	supportReminder: ThankYouSupportReminderState;
};

export const initialThankYouState: ThankYouState = {
	feedbackSurveyHasBeenCompleted: false,
	marketingConsent: {
		hasBeenCompleted: false,
		hasConsented: false,
		errorMessage: '',
	},
	supportReminder: {
		selectedChoiceIndex: 0,
		hasBeenCompleted: false,
		errorMessage: '',
	},
};
