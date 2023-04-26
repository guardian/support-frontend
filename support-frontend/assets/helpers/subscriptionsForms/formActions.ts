import type { CsrCustomerData } from 'components/csr/csrMode';
import { csrUserName } from 'components/csr/csrMode';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
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
	setBillingAddressMatchesDelivery,
	setDeliveryInstructions,
} from 'helpers/redux/checkout/addressMeta/actions';
import {
	setEmail as setEmailGift,
	setFirstName as setFirstNameGift,
	setGiftDeliveryDate,
	setGiftMessage,
	setLastName as setLastNameGift,
	setTitle as setTitleGift,
} from 'helpers/redux/checkout/giftingState/actions';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
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
	setBillingPeriod,
	setOrderIsAGift,
	setStartDate,
} from 'helpers/redux/checkout/product/actions';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from 'helpers/redux/subscriptionsStore';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
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
			type: 'SET_ORDER_IS_GIFT';
			orderIsAGift: boolean;
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
	  };

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
	setStartDate,
	setBillingPeriod,
	setPaymentMethod,
	setBillingAddressMatchesDelivery,
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
	setDeliveryInstructions,
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
	formActionCreators,
};
