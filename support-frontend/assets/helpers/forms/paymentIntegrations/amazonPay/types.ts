// ---- Types ---- //

export interface AmazonLoginObject {
	setClientId: (clientId: string) => void;
	setSandboxMode: (sandboxMode: boolean) => void;
}

export interface AmazonObject {
	Login: AmazonLoginObject;
}

interface Wallet {
	bind: (ID: string) => void;
}

export interface BaseWalletConfig {
	sellerId: string;
	design: {
		designMode: string;
	};
	onPaymentSelect: () => void;
	onError: (error: { getErrorMessage: () => string }) => void;
}

interface WalletConfig extends BaseWalletConfig {
	onReady?: (billingAgreement: {
		getAmazonBillingAgreementId: () => string;
	}) => void;
	agreementType: string;
	amazonOrderReferenceId?: string | null;
	onOrderReferenceCreate?: (orderReference: {
		getAmazonOrderReferenceId: () => string;
	}) => void;
}

interface WalletConstructor {
	new (baseWalletConfig: WalletConfig): Wallet;
}

interface Consent {
	bind: (ID: string) => void;
}

export interface ConsentConfig {
	sellerId: string;
	amazonBillingAgreementId: string;
	onReady: (billingAgreementConsentStatus: {
		getConsentStatus: () => 'true' | 'false';
	}) => void;
	onConsent: (billingAgreementConsentStatus: {
		getConsentStatus: () => 'true' | 'false';
	}) => void;
	design: {
		designMode: string;
	};
	onError: (error: { getErrorMessage: () => string }) => void;
}

interface ConsentConstructor {
	new (baseConsentConfig: ConsentConfig): Consent;
}

export interface AmazonPaymentsObject {
	Widgets: {
		Wallet: WalletConstructor;
		Consent: ConsentConstructor;
	};
}
export interface AmazonPayLibrary {
	amazonLoginObject: AmazonLoginObject | null;
	amazonPaymentsObject: AmazonPaymentsObject | null;
}

export interface AmazonPayData {
	hasBegunLoading: boolean;
	// to avoid loading the sdk more than once
	amazonPayLibrary: AmazonPayLibrary;
	// sdk objects
	walletIsStale: boolean;
	// for re-rendering the wallet widget when an error needs to be displayed
	hasAccessToken: boolean;
	// set when user logs in
	paymentSelected: boolean;
	// indicates if user has selected a payment method from their wallet
	fatalError: boolean;
	// for when we cannot use amazon pay
	orderReferenceId: string | null;
	// for one-off contributions
	amazonBillingAgreementId?: string;
	// for recurring contributions
	amazonBillingAgreementConsentStatus: boolean; // for recurring contributions
}
