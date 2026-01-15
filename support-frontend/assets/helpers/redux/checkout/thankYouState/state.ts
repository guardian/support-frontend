export interface ThankYouMarketingConsentState {
	hasBeenCompleted: boolean;
	hasConsented: boolean;
	errorMessage: string | null;
}

export type ThankYouState = {
	marketingConsent: ThankYouMarketingConsentState;
};

export const initialThankYouState: ThankYouState = {
	marketingConsent: {
		hasBeenCompleted: false,
		hasConsented: false,
		errorMessage: '',
	},
};
