import type { Dispatch } from 'redux';
import type { Action as DDAction } from 'components/directDebit/directDebitActions';
import type { Action as AddressAction } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { Action as PayPalAction } from 'helpers/forms/paymentIntegrations/payPalActions';
import { showPayPal } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import * as storage from 'helpers/storage/storage';
import { setFormSubmissionDependentValue } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { trackThankYouPageLoaded } from 'helpers/tracking/behaviour';
import type { Option } from 'helpers/types/option';
import type { FormField, Stage } from './formFields';

export type Action =
	| {
			type: 'SET_STAGE';
			stage: Stage;
	  }
	| {
			type: 'SET_TITLE';
			title: Option<string>;
	  }
	| {
			type: 'SET_FIRST_NAME';
			firstName: string;
	  }
	| {
			type: 'SET_LAST_NAME';
			lastName: string;
	  }
	| {
			type: 'SET_EMAIL';
			email: string;
	  }
	| {
			type: 'SET_CONFIRM_EMAIL';
			email: string;
	  }
	| {
			type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE';
			userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	  }
	| {
			type: 'SET_TELEPHONE';
			telephone: string;
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
	| AddressAction
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

const setUserTypeFromIdentityResponse =
	(
		userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
	): ((arg0: (...args: any[]) => any) => void) =>
	(dispatch: (...args: any[]) => any): void => {
		dispatch(
			setFormSubmissionDependentValue(() => ({
				type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE',
				userTypeFromIdentityResponse,
			})),
		);
	};

const formActionCreators = {
	setTitle: (title: string): Action => ({
		type: 'SET_TITLE',
		title: title !== '' ? title : null,
	}),
	setFirstName: (firstName: string): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_FIRST_NAME',
			firstName,
		})),
	setLastName: (lastName: string): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_LAST_NAME',
			lastName,
		})),
	setEmail: (email: string): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_EMAIL',
			email,
		})),
	setConfirmEmail: (email: string): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_CONFIRM_EMAIL',
			email,
		})),
	setTelephone: (telephone: string): Action => ({
		type: 'SET_TELEPHONE',
		telephone,
	}),
	setTitleGift: (titleGiftRecipient: string): Action => ({
		type: 'SET_TITLE_GIFT',
		titleGiftRecipient: titleGiftRecipient !== '' ? titleGiftRecipient : null,
	}),
	setFirstNameGift: (
		firstNameGiftRecipient: string,
	): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_FIRST_NAME_GIFT',
			firstNameGiftRecipient,
		})),
	setLastNameGift: (lastNameGiftRecipient: string): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_LAST_NAME_GIFT',
			lastNameGiftRecipient,
		})),
	setEmailGift: (emailGiftRecipient: string): ((...args: any[]) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_EMAIL_GIFT',
			emailGiftRecipient,
		})),
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
		(dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
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
		(dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
			const state = getState();
			onPaymentAuthorised(authorisation, dispatch, state);
		},
	setGiftStatus: (orderIsAGift: boolean): Action => ({
		type: 'SET_ORDER_IS_GIFT',
		orderIsAGift,
	}),
	setStripePaymentMethod: (stripePaymentMethod: Option<string>): Action => ({
		type: 'SET_STRIPE_PAYMENT_METHOD',
		stripePaymentMethod,
	}),
	setDeliveryInstructions: (instructions: string | null): Action => ({
		type: 'SET_DELIVERY_INSTRUCTIONS',
		instructions,
	}),
	setGiftMessage: (message: string | null): Action => ({
		type: 'SET_GIFT_MESSAGE',
		message,
	}),
	setDigitalGiftDeliveryDate: (giftDeliveryDate: string): Action => ({
		type: 'SET_GIFT_DELIVERY_DATE',
		giftDeliveryDate,
	}),
	setAddDigitalSubscription: (addDigital: boolean): Action => ({
		type: 'SET_ADD_DIGITAL_SUBSCRIPTION',
		addDigital,
	}),
};
export type FormActionCreators = typeof formActionCreators;
export {
	setStage,
	setFormErrors,
	setSubmissionError,
	setFormSubmitted,
	setUserTypeFromIdentityResponse,
	formActionCreators,
};
