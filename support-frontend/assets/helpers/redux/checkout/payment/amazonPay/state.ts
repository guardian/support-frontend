export interface AmazonPayState {
	walletIsStale: boolean;
	hasAccessToken: boolean;
	paymentSelected: boolean;
	fatalError: boolean;
	orderReferenceId: string | null;
	amazonBillingAgreementId?: string;
	amazonBillingAgreementConsentStatus: boolean;
	errors: {
		paymentSelected?: string[];
		consentStatus?: string[];
	};
}

export const initialAmazonPayState: AmazonPayState = {
	walletIsStale: false,
	orderReferenceId: null,
	paymentSelected: false,
	hasAccessToken: false,
	fatalError: false,
	amazonBillingAgreementConsentStatus: false,
	errors: {},
};
