// ---- Types ---- //

export interface AmazonLoginObject {
	setClientId: (clientId: string) => void;
	setSandboxMode: (sandboxMode: boolean) => void;
	authorize: (
		login: { scope: string; popup: boolean },
		cb: (response: { error?: string }) => void,
	) => void;
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
