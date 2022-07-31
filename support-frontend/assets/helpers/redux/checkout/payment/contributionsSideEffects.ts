import { isAnyOf } from '@reduxjs/toolkit';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
} from './amazonPay/actions';
import { setPopupOpen } from './directDebit/actions';
import {
	setSepaAccountHolderName,
	setSepaAddressCountry,
	setSepaAddressStreetName,
	setSepaIban,
} from './sepa/actions';

export function addPaymentsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setPopupOpen,
		effect() {
			// TODO: we should do this on the payment method selection action instead in future
			storage.setSession('selectedPaymentMethod', DirectDebit);
		},
	});

	startListening({
		matcher: shouldCheckFormEnabled,
		effect(_action, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}

// ---- Matchers ---- //

const shouldCheckFormEnabled = isAnyOf(
	setAmazonPayPaymentSelected,
	setAmazonPayOrderReferenceId,
	setAmazonPayBillingAgreementId,
	setAmazonPayBillingAgreementConsentStatus,
	setSepaIban,
	setSepaAccountHolderName,
	setSepaAddressStreetName,
	setSepaAddressCountry,
);
