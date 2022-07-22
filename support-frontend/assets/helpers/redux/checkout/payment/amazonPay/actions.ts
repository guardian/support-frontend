import { amazonPaySlice } from './reducer';

export const {
	setAmazonPayWalletIsStale,
	setAmazonPayHasAccessToken,
	setAmazonPayFatalError,
	setAmazonPayPaymentSelected,
	setAmazonPayOrderReferenceId,
	setAmazonPayBillingAgreementId,
	setAmazonPayBillingAgreementConsentStatus,
} = amazonPaySlice.actions;
