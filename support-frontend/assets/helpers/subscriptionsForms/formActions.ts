import type { CsrCustomerData } from 'components/csr/csrMode';
import { csrUserName } from 'components/csr/csrMode';
import type { Action as DDAction } from 'components/directDebit/directDebitActions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { Action as PayPalAction } from 'helpers/forms/paymentIntegrations/payPalActions';
import { showPayPal } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	setBillingAddressLineOne,
	setBillingCountry,
	setBillingPostcode,
	setBillingState,
	setBillingTownCity,
	setDeliveryAddressLineOne,
	setDeliveryCountry,
	setDeliveryPostcode,
	setDeliveryState,
	setDeliveryTownCity,
} from 'helpers/redux/checkout/address/actions';
import {
	setEmail as setEmailGift,
	setFirstName as setFirstNameGift,
	setGiftDeliveryDate,
	setGiftMessage,
	setLastName as setLastNameGift,
	setTitle as setTitleGift,
} from 'helpers/redux/checkout/giftingState/actions';
import {
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setTelephone,
	setTitle,
} from 'helpers/redux/checkout/personalDetails/actions';
import {
	setAddDigital,
	setOrderIsAGift,
} from 'helpers/redux/checkout/product/actions';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from 'helpers/redux/subscriptionsStore';
import * as storage from 'helpers/storage/storage';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { trackThankYouPageLoaded } from 'helpers/tracking/behaviour';
import type { Option } from 'helpers/types/option';
import type { AddressType } from './addressType';
import type { FormField, Stage } from './formFields';

export type Action =
	| {
			type: 'SET_STAGE';
			stage: Stage;
	  }
	| {
			type: 'SET_TITLE_GIFT';
			titleGiftRecipient: Option<string>;
	  }
	| {
			type: 'SET_FIRST_NAME_GIFT';
			firstNameGiftRecipient: string;
	  }
	| {
			type: 'SET_LAST_NAME_GIFT';
			lastNameGiftRecipient: string;
	  }
	| {
			type: 'SET_EMAIL_GIFT';
			emailGiftRecipient: string;
	  }
	| {
			type: 'SET_START_DATE';
			startDate: string;
	  }
	| {
			type: 'SET_BILLING_PERIOD';
			billingPeriod: BillingPeriod;
	  }
	| {
			type: 'SET_PAYMENT_METHOD';
			paymentMethod: PaymentMethod;
	  }
	| {
			type: 'SET_FORM_ERRORS';
			errors: Array<FormError<FormField>>;
	  }
	| {
			type: 'SET_SUBMISSION_ERROR';
			error: ErrorReason;
	  }
	| {
			type: 'SET_FORM_SUBMITTED';
			formSubmitted: boolean;
	  }
	| {
			type: 'SET_BILLING_ADDRESS_IS_SAME';
			isSame: boolean;
	  }
	| {
			type: 'SET_ORDER_IS_GIFT';
			orderIsAGift: boolean;
	  }
	| {
			type: 'SET_DELIVERY_INSTRUCTIONS';
			instructions: Option<string>;
	  }
	| {
			type: 'SET_STRIPE_PAYMENT_METHOD';
			stripePaymentMethod: Option<string>;
	  }
	| {
			type: 'SET_GIFT_MESSAGE';
			message: Option<string>;
	  }
	| {
			type: 'SET_GIFT_DELIVERY_DATE';
			giftDeliveryDate: string;
	  }
	| {
			type: 'SET_ADD_DIGITAL_SUBSCRIPTION';
			addDigital: boolean;
	  }
	| {
			type: 'SET_CSR_USERNAME';
			username: string;
	  }
	| {
			type: 'SET_SALESFORCE_CASE_ID';
			caseId: string;
	  }
	| {
			type: 'ON_DELIVERY_COUNTRY_CHANGED';
			country: string;
	  }
	| PayPalAction
	| DDAction;

// ----- Action Creators ----- //
const setStage = (
	stage: Stage,
	product: SubscriptionProduct,
	paymentMethod: PaymentMethod | null | undefined,
): Action => {
	if (stage === 'thankyou' || stage === 'thankyou-pending') {
		trackThankYouPageLoaded(product, paymentMethod);
	}

	return {
		type: 'SET_STAGE',
		stage,
	};
};

const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({
	type: 'SET_FORM_ERRORS',
	errors,
});

const setSubmissionError = (error: ErrorReason): Action => ({
	type: 'SET_SUBMISSION_ERROR',
	error,
});

const setFormSubmitted = (formSubmitted: boolean): Action => ({
	type: 'SET_FORM_SUBMITTED',
	formSubmitted,
});

const onDeliveryCountryChanged = (country: string): Action => ({
	type: 'ON_DELIVERY_COUNTRY_CHANGED',
	country,
});

const formActionCreators = {
	setTitle,
	setFirstName,
	setLastName,
	setEmail,
	setConfirmEmail,
	setTelephone,
	setTitleGift,
	setFirstNameGift,
	setLastNameGift,
	setEmailGift,
	setStartDate: (startDate: string): Action => ({
		type: 'SET_START_DATE',
		startDate,
	}),
	setBillingPeriod: (billingPeriod: BillingPeriod): Action => ({
		type: 'SET_BILLING_PERIOD',
		billingPeriod,
	}),
	setPaymentMethod:
		(paymentMethod: PaymentMethod) =>
		(
			dispatch: SubscriptionsDispatch,
			getState: () => CheckoutState,
		): Action => {
			const state = getState();
			storage.setSession('selectedPaymentMethod', paymentMethod);
			sendTrackingEventsOnClick({
				id: `subscriptions-payment-method-selector-${paymentMethod}`,
				componentType: 'ACQUISITIONS_OTHER',
			})();

			if (paymentMethod === PayPal && !state.page.checkout.payPalHasLoaded) {
				showPayPal(dispatch);
			}

			return dispatch({
				type: 'SET_PAYMENT_METHOD',
				paymentMethod,
			});
		},
	setBillingAddressIsSame: (isSame: boolean): Action => ({
		type: 'SET_BILLING_ADDRESS_IS_SAME',
		isSame,
	}),
	onPaymentAuthorised:
		(authorisation: PaymentAuthorisation) =>
		(
			dispatch: SubscriptionsDispatch,
			getState: () => SubscriptionsState,
		): void => {
			const state = getState();
			onPaymentAuthorised(authorisation, dispatch, state);
		},
	setGiftStatus: setOrderIsAGift,
	setStripePaymentMethod: (stripePaymentMethod: Option<string>): Action => ({
		type: 'SET_STRIPE_PAYMENT_METHOD',
		stripePaymentMethod,
	}),
	setDeliveryInstructions: (instructions: string | null): Action => ({
		type: 'SET_DELIVERY_INSTRUCTIONS',
		instructions,
	}),
	setGiftMessage,
	setDigitalGiftDeliveryDate: setGiftDeliveryDate,
	setAddDigitalSubscription: setAddDigital,
	setCsrUsername: (username: string): Action => ({
		type: 'SET_CSR_USERNAME',
		username,
	}),
	setSalesforceCaseId: (caseId: string): Action => ({
		type: 'SET_SALESFORCE_CASE_ID',
		caseId,
	}),
};

function setCsrCustomerData(
	addressType: AddressType,
	csrCustomerData: CsrCustomerData,
) {
	return (dispatch: SubscriptionsDispatch): void => {
		const { email, firstName, country, street, city, postcode, state } =
			csrCustomerData.customer;

		email && dispatch(formActionCreators.setEmail(email));
		email && dispatch(formActionCreators.setConfirmEmail(email));
		firstName && dispatch(formActionCreators.setFirstName(firstName));
		dispatch(formActionCreators.setLastName(csrCustomerData.customer.lastName));

		dispatch(formActionCreators.setCsrUsername(csrUserName(csrCustomerData)));
		dispatch(formActionCreators.setSalesforceCaseId(csrCustomerData.caseId));

		const addressActions = addressActionCreatorsFor(addressType);
		country && dispatch(addressActions.setCountry(country));
		street && dispatch(addressActions.setAddressLineOne(street));
		city && dispatch(addressActions.setTownCity(city));
		postcode && dispatch(addressActions.setPostcode(postcode));
		state && dispatch(addressActions.setState(state));
	};
}

function addressActionCreatorsFor(addressType: AddressType) {
	return addressType === 'billing'
		? {
				setCountry: setBillingCountry,
				setAddressLineOne: setBillingAddressLineOne,
				setTownCity: setBillingTownCity,
				setPostcode: setBillingPostcode,
				setState: setBillingState,
		  }
		: {
				setCountry: setDeliveryCountry,
				setAddressLineOne: setDeliveryAddressLineOne,
				setTownCity: setDeliveryTownCity,
				setPostcode: setDeliveryPostcode,
				setState: setDeliveryState,
		  };
}

export type FormActionCreators = typeof formActionCreators;
export {
	setStage,
	setFormErrors,
	setSubmissionError,
	setFormSubmitted,
	setCsrCustomerData,
	onDeliveryCountryChanged,
	formActionCreators,
};
