import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
} from './amazonPay/actions';
import { setPaymentMethod } from './paymentMethod/actions';
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
		actionCreator: setPaymentMethod,
		effect(action) {
			storage.setSession('selectedPaymentMethod', action.payload);
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
	setPaymentMethod,
	setAmazonPayPaymentSelected,
	setAmazonPayOrderReferenceId,
	setAmazonPayBillingAgreementId,
	setAmazonPayBillingAgreementConsentStatus,
	setSepaIban,
	setSepaAccountHolderName,
	setSepaAddressStreetName,
	setSepaAddressCountry,
);
