import type { PayloadAction } from '@reduxjs/toolkit';
import { isAnyOf } from '@reduxjs/toolkit';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { PayPal } from 'helpers/forms/paymentMethods';
import type {
	ContributionsDispatch,
	ContributionsStartListening,
} from 'helpers/redux/contributionsStore';
import * as storage from 'helpers/storage/storage';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import { expireRecaptchaToken, setRecaptchaToken } from '../recaptcha/actions';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
} from './amazonPay/actions';
import { setPaymentMethod } from './paymentMethod/actions';
import type { PayPalState } from './payPal/state';
import { loadPayPalExpressSdk } from './payPal/thunks';
import {
	setSepaAccountHolderName,
	setSepaAddressCountry,
	setSepaAddressStreetName,
	setSepaIban,
} from './sepa/actions';

function handlePaymentMethodChange(action: PayloadAction<PaymentMethod>) {
	const paymentMethod = action.payload;
	storage.setSession('selectedPaymentMethod', paymentMethod);
}

function maybeLoadPaypal(
	action: PayloadAction<PaymentMethod>,
	payPal: PayPalState,
	dispatch: ContributionsDispatch,
) {
	if (action.payload === PayPal && !payPal.hasBegunLoading) {
		void dispatch(loadPayPalExpressSdk());
	}
}

export function addPaymentsSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(action, listenerApi) {
			if (setPaymentMethod.match(action)) {
				handlePaymentMethodChange(action);
				maybeLoadPaypal(
					action,
					listenerApi.getState().page.checkoutForm.payment.payPal,
					listenerApi.dispatch,
				);
			}
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}

// ---- Matchers ---- //

const shouldCheckFormEnabled = isAnyOf(
	setRecaptchaToken,
	expireRecaptchaToken,
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
