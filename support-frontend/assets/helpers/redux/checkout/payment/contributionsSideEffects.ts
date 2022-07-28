import { isAnyOf } from '@reduxjs/toolkit';
import { PayPal } from 'helpers/forms/paymentMethods';
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
import { loadPayPalExpressSdk } from './payPal/reducer';
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
		matcher: shouldCheckFormEnabled,
		effect(action, listenerApi) {
			if (setPaymentMethod.match(action)) {
				const paymentMethod = action.payload;
				const { payPal } = listenerApi.getState().page.checkoutForm.payment;
				storage.setSession('selectedPaymentMethod', paymentMethod);
				if (paymentMethod === PayPal && !payPal.hasBegunLoading) {
					void listenerApi.dispatch(loadPayPalExpressSdk());
				}
			}
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
