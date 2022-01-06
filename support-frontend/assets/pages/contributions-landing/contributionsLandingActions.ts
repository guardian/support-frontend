// ----- Imports ----- //
import type { PaymentIntentResult } from '@stripe/stripe-js';
import type { Dispatch } from 'redux';
import { getForm } from 'helpers/checkoutForm/checkoutForm';
import type { FormSubmitParameters } from 'helpers/checkoutForm/onFormSubmit';
import { onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import type {
	ContributionType,
	PaymentMatrix,
	SelectedAmounts,
} from 'helpers/contributions';
import { getAmount, logInvalidCombination } from 'helpers/contributions';
import type { ThirdPartyPaymentLibrary } from 'helpers/forms/checkouts';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { setupAmazonPay } from 'helpers/forms/paymentIntegrations/amazonPay';
import type {
	AmazonPayData,
	CreatePaypalPaymentData,
	CreatePayPalPaymentResponse,
	CreateStripePaymentIntentRequest,
	StripeChargeData,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import {
	postOneOffAmazonPayExecutePaymentRequest,
	postOneOffPayPalCreatePaymentRequest,
	processStripePaymentIntentRequest,
} from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type { Action as PayPalAction } from 'helpers/forms/paymentIntegrations/payPalActions';
import { setPayPalHasLoaded } from 'helpers/forms/paymentIntegrations/payPalActions';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type {
	AmazonPayAuthorisation,
	PaymentAuthorisation,
	PaymentResult,
	RegularPaymentRequest,
	StripePaymentIntentAuthorisation,
	StripePaymentMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	postRegularPaymentRequest,
	regularPaymentFieldsFromAuthorisation,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { StripeAccount } from 'helpers/forms/stripe';
import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import {
	findIsoCountry,
	stateProvinceFromString,
} from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';
import * as cookie from 'helpers/storage/cookie';
import * as storage from 'helpers/storage/storage';
import {
	derivePaymentApiAcquisitionData,
	getOphanIds,
	getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import trackConversion from 'helpers/tracking/conversions';
import type { Option } from 'helpers/types/option';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { setFormSubmissionDependentValue } from './checkoutFormIsSubmittableActions';
import type {
	State,
	Stripe3DSResult,
	UserFormData,
} from './contributionsLandingReducer';

export type Action =
	| {
			type: 'UPDATE_CONTRIBUTION_TYPE';
			contributionType: ContributionType;
	  }
	| {
			type: 'UPDATE_PAYMENT_METHOD';
			paymentMethod: PaymentMethod;
	  }
	| {
			type: 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD';
			existingPaymentMethod: RecentlySignedInExistingPaymentMethod;
	  }
	| {
			type: 'UPDATE_FIRST_NAME';
			firstName: string;
	  }
	| {
			type: 'UPDATE_LAST_NAME';
			lastName: string;
	  }
	| {
			type: 'UPDATE_EMAIL';
			email: string;
	  }
	| {
			type: 'UPDATE_BILLING_STATE';
			billingState: StateProvince | null;
	  }
	| {
			type: 'UPDATE_BILLING_COUNTRY';
			billingCountry: IsoCountry | null;
	  }
	| {
			type: 'UPDATE_USER_FORM_DATA';
			userFormData: UserFormData;
	  }
	| {
			type: 'UPDATE_PAYMENT_READY';
			thirdPartyPaymentLibraryByContrib: Record<
				ContributionType,
				Record<PaymentMethod, ThirdPartyPaymentLibrary>
			>;
	  }
	| {
			type: 'SET_AMAZON_PAY_HAS_BEGUN_LOADING';
	  }
	| {
			type: 'SET_AMAZON_PAY_LOGIN_OBJECT';
			amazonLoginObject: Record<string, any>;
	  }
	| {
			type: 'SET_AMAZON_PAY_PAYMENTS_OBJECT';
			amazonPaymentsObject: Record<string, any>;
	  }
	| {
			type: 'SET_AMAZON_PAY_WALLET_IS_STALE';
			isStale: boolean;
	  }
	| {
			type: 'SET_AMAZON_PAY_ORDER_REFERENCE_ID';
			orderReferenceId: string;
	  }
	| {
			type: 'SET_AMAZON_PAY_PAYMENT_SELECTED';
			paymentSelected: boolean;
	  }
	| {
			type: 'SET_AMAZON_PAY_HAS_ACCESS_TOKEN';
	  }
	| {
			type: 'SET_AMAZON_PAY_FATAL_ERROR';
	  }
	| {
			type: 'SET_AMAZON_PAY_BILLING_AGREEMENT_ID';
			amazonBillingAgreementId: string;
	  }
	| {
			type: 'SET_AMAZON_PAY_BILLING_AGREEMENT_CONSENT_STATUS';
			amazonBillingAgreementConsentStatus: boolean;
	  }
	| {
			type: 'UPDATE_RECAPTCHA_TOKEN';
			recaptchaToken: string;
	  }
	| {
			type: 'SELECT_AMOUNT';
			amount: number | 'other';
			contributionType: ContributionType;
	  }
	| {
			type: 'SELECT_AMOUNTS';
			amounts: SelectedAmounts;
	  }
	| {
			type: 'UPDATE_OTHER_AMOUNT';
			otherAmount: string;
			contributionType: ContributionType;
	  }
	| {
			type: 'PAYMENT_RESULT';
			paymentResult: Promise<PaymentResult>;
	  }
	| {
			type: 'PAYMENT_FAILURE';
			paymentError: ErrorReason;
	  }
	| {
			type: 'PAYMENT_WAITING';
			isWaiting: boolean;
	  }
	| {
			type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED';
	  }
	| {
			type: 'SET_FORM_IS_SUBMITTABLE';
			formIsSubmittable: boolean;
	  }
	| {
			type: 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED';
			stripeAccount: StripeAccount;
	  }
	| {
			type: 'SET_STRIPE_PAYMENT_REQUEST_ERROR';
			paymentError: ErrorReason;
			stripeAccount: StripeAccount;
	  }
	| {
			type: 'SET_STRIPE_V3_HAS_LOADED';
	  }
	| {
			type: 'SET_CREATE_STRIPE_PAYMENT_METHOD';
			createStripePaymentMethod: (clientSecret: string | null) => void;
	  }
	| {
			type: 'SET_HANDLE_STRIPE_3DS';
			handleStripe3DS: (clientSecret: string) => Promise<PaymentIntentResult>;
	  }
	| {
			type: 'SET_STRIPE_CARD_FORM_COMPLETE';
			isComplete: boolean;
	  }
	| {
			type: 'SET_STRIPE_SETUP_INTENT_CLIENT_SECRET';
			setupIntentClientSecret: string;
	  }
	| {
			type: 'SET_STRIPE_RECURRING_RECAPTCHA_VERIFIED';
			recaptchaVerified: boolean;
	  }
	| {
			type: 'SET_PAYPAL_HAS_BEGUN_LOADING';
	  }
	| PayPalAction
	| {
			type: 'SET_HAS_SEEN_DIRECT_DEBIT_THANK_YOU_COPY';
	  }
	| {
			type: 'PAYMENT_SUCCESS';
	  }
	| {
			type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE';
			userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	  }
	| {
			type: 'SET_FORM_IS_VALID';
			isValid: boolean;
	  }
	| {
			type: 'SET_TICKER_GOAL_REACHED';
			tickerGoalReached: boolean;
	  }
	| {
			type: 'UPDATE_PAYPAL_BUTTON_READY';
			ready: boolean;
	  }
	| {
			type: 'SET_SEPA_IBAN';
			iban: string | null;
	  }
	| {
			type: 'SET_SEPA_ACCOUNT_HOLDER_NAME';
			accountHolderName: string | null;
	  };

const setFormIsValid = (isValid: boolean): Action => ({
	type: 'SET_FORM_IS_VALID',
	isValid,
});

const setPayPalHasBegunLoading = (): Action => ({
	type: 'SET_PAYPAL_HAS_BEGUN_LOADING',
});

const updatePayPalButtonReady = (ready: boolean): Action => ({
	type: 'UPDATE_PAYPAL_BUTTON_READY',
	ready,
});

// Do not export this, as we only want it to be called via updateContributionTypeAndPaymentMethod
const updateContributionType =
	(contributionType: ContributionType) =>
	(dispatch: Dispatch, getState: () => State): void => {
		dispatch(updatePayPalButtonReady(false));
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_CONTRIBUTION_TYPE',
			contributionType,
		}))(dispatch, getState);
	};

const updatePaymentMethod =
	(paymentMethod: PaymentMethod) =>
	(dispatch: Dispatch, getState: () => State): void => {
		// PayPal one-off redirects away from the site before hitting the thank you page
		// so we need to store the payment method in the storage so that it is available on the
		// thank you page in all scenarios.
		storage.setSession('selectedPaymentMethod', paymentMethod);
		dispatch(updatePayPalButtonReady(false));
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_PAYMENT_METHOD',
			paymentMethod,
		}))(dispatch, getState);
	};

const updateSelectedExistingPaymentMethod = (
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
): Action => ({
	type: 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD',
	existingPaymentMethod,
});

const updateFirstName =
	(firstName: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_FIRST_NAME',
			firstName,
		}))(dispatch, getState);
	};

const updateLastName =
	(lastName: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_LAST_NAME',
			lastName,
		}))(dispatch, getState);
	};

const updateEmail =
	(email: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		// PayPal one-off redirects away from the site before hitting the thank you page
		// so we need to store the email in the storage so that it is available on the
		// thank you page in all scenarios.
		storage.setSession('gu.email', email);
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_EMAIL',
			email,
		}))(dispatch, getState);
	};

const updateRecaptchaToken =
	(recaptchaToken: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_RECAPTCHA_TOKEN',
			recaptchaToken,
		}))(dispatch, getState);
	};

const setStripePaymentRequestButtonClicked = (
	stripeAccount: StripeAccount,
): Action => ({
	type: 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED',
	stripeAccount,
});

const setStripePaymentRequestButtonError = (
	paymentError: ErrorReason,
	stripeAccount: StripeAccount,
): Action => ({
	type: 'SET_STRIPE_PAYMENT_REQUEST_ERROR',
	paymentError,
	stripeAccount,
});

const updateUserFormData =
	(userFormData: UserFormData) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_USER_FORM_DATA',
			userFormData,
		}))(dispatch, getState);
	};

const updateBillingState =
	(billingState: StateProvince | null) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_BILLING_STATE',
			billingState,
		}))(dispatch, getState);
	};

const updateBillingCountry = (billingCountry: IsoCountry | null): Action => ({
	type: 'UPDATE_BILLING_COUNTRY',
	billingCountry,
});

const selectAmount =
	(amount: number | 'other', contributionType: ContributionType) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SELECT_AMOUNT',
			amount,
			contributionType,
		}))(dispatch, getState);
	};

const selectAmounts =
	(amounts: SelectedAmounts) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SELECT_AMOUNTS',
			amounts,
		}))(dispatch, getState);
	};

const setCheckoutFormHasBeenSubmitted = (): Action => ({
	type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED',
});

const updateOtherAmount =
	(otherAmount: string, contributionType: ContributionType) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'UPDATE_OTHER_AMOUNT',
			otherAmount,
			contributionType,
		}))(dispatch, getState);
	};

const paymentSuccess = (): Action => ({
	type: 'PAYMENT_SUCCESS',
});

const paymentWaiting = (isWaiting: boolean): Action => ({
	type: 'PAYMENT_WAITING',
	isWaiting,
});

const paymentFailure = (paymentError: ErrorReason): Action => ({
	type: 'PAYMENT_FAILURE',
	paymentError,
});

const setAmazonPayHasBegunLoading = (): Action => ({
	type: 'SET_AMAZON_PAY_HAS_BEGUN_LOADING',
});

const setAmazonPayLoginObject = (
	amazonLoginObject: Record<string, any>,
): Action => ({
	type: 'SET_AMAZON_PAY_LOGIN_OBJECT',
	amazonLoginObject,
});

const setAmazonPayPaymentsObject = (
	amazonPaymentsObject: Record<string, any>,
): Action => ({
	type: 'SET_AMAZON_PAY_PAYMENTS_OBJECT',
	amazonPaymentsObject,
});

const setAmazonPayWalletIsStale = (isStale: boolean): Action => ({
	type: 'SET_AMAZON_PAY_WALLET_IS_STALE',
	isStale,
});

const setAmazonPayHasAccessToken: Action = {
	type: 'SET_AMAZON_PAY_HAS_ACCESS_TOKEN',
};
const setAmazonPayFatalError: Action = {
	type: 'SET_AMAZON_PAY_FATAL_ERROR',
};

const setAmazonPayPaymentSelected =
	(paymentSelected: boolean) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_AMAZON_PAY_PAYMENT_SELECTED',
			paymentSelected,
		}))(dispatch, getState);
	};

const setAmazonPayOrderReferenceId =
	(orderReferenceId: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_AMAZON_PAY_ORDER_REFERENCE_ID',
			orderReferenceId,
		}))(dispatch, getState);
	};

const setAmazonPayBillingAgreementId =
	(amazonBillingAgreementId: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_AMAZON_PAY_BILLING_AGREEMENT_ID',
			amazonBillingAgreementId,
		}))(dispatch, getState);
	};

const setAmazonPayBillingAgreementConsentStatus =
	(amazonBillingAgreementConsentStatus: boolean) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_AMAZON_PAY_BILLING_AGREEMENT_CONSENT_STATUS',
			amazonBillingAgreementConsentStatus,
		}))(dispatch, getState);
	};

const setUserTypeFromIdentityResponse =
	(userTypeFromIdentityResponse: UserTypeFromIdentityResponse) =>
	(dispatch: Dispatch, getState: () => State): void => {
		// PayPal one-off redirects away from the site before hitting the thank you page, and we'll need userType
		storage.setSession(
			'userTypeFromIdentityResponse',
			userTypeFromIdentityResponse,
		);
		setFormSubmissionDependentValue(() => ({
			type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE',
			userTypeFromIdentityResponse,
		}))(dispatch, getState);
	};

// We defer loading 3rd party payment SDKs until the user selects one, or one is selected by default
const loadPayPalExpressSdk =
	(contributionType: ContributionType) =>
	(dispatch: Dispatch): void => {
		if (contributionType !== 'ONE_OFF') {
			dispatch(setPayPalHasBegunLoading());
			void loadPayPalRecurring().then(() => dispatch(setPayPalHasLoaded()));
		}
	};

const loadAmazonPaySdk =
	(countryGroupId: CountryGroupId, isTestUser: boolean) =>
	(dispatch: Dispatch): void => {
		dispatch(setAmazonPayHasBegunLoading());
		setupAmazonPay(countryGroupId, dispatch, isTestUser);
	};

const updateContributionTypeAndPaymentMethod =
	(contributionType: ContributionType, paymentMethodToSelect: PaymentMethod) =>
	(dispatch: Dispatch, getState: () => State): void => {
		// PayPal one-off redirects away from the site before hitting the thank you page
		// so we need to store the contrib type & payment method in the storage so that it is available on the
		// thank you page in all scenarios.
		storage.setSession('selectedContributionType', contributionType);
		storage.setSession('selectedPaymentMethod', paymentMethodToSelect);
		updateContributionType(contributionType)(dispatch, getState);
		updatePaymentMethod(paymentMethodToSelect)(dispatch, getState);
	};

const getUserType =
	(email: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		const state = getState();
		const { csrf } = state.page;
		const { isSignedIn } = state.page.user;
		void getUserTypeFromIdentity(
			email,
			isSignedIn,
			csrf,
			(userType: UserTypeFromIdentityResponse) =>
				setUserTypeFromIdentityResponse(userType)(dispatch, getState),
		);
	};

const setTickerGoalReached = (): Action => ({
	type: 'SET_TICKER_GOAL_REACHED',
	tickerGoalReached: true,
});

const setCreateStripePaymentMethod = (
	createStripePaymentMethod: (clientSecret: string | null) => void,
): Action => ({
	type: 'SET_CREATE_STRIPE_PAYMENT_METHOD',
	createStripePaymentMethod,
});

const setHandleStripe3DS = (
	handleStripe3DS: (clientSecret: string) => Promise<PaymentIntentResult>,
): Action => ({
	type: 'SET_HANDLE_STRIPE_3DS',
	handleStripe3DS,
});

const setStripeCardFormComplete =
	(isComplete: boolean) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_STRIPE_CARD_FORM_COMPLETE',
			isComplete,
		}))(dispatch, getState);
	};

const setStripeSetupIntentClientSecret =
	(setupIntentClientSecret: string) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_STRIPE_SETUP_INTENT_CLIENT_SECRET',
			setupIntentClientSecret,
		}))(dispatch, getState);
	};

const setStripeRecurringRecaptchaVerified =
	(recaptchaVerified: boolean) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_STRIPE_RECURRING_RECAPTCHA_VERIFIED',
			recaptchaVerified,
		}))(dispatch, getState);
	};

const setSepaIban =
	(iban: string | null) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_SEPA_IBAN',
			iban,
		}))(dispatch, getState);
	};

const setSepaAccountHolderName =
	(accountHolderName: string | null) =>
	(dispatch: Dispatch, getState: () => State): void => {
		setFormSubmissionDependentValue(() => ({
			type: 'SET_SEPA_ACCOUNT_HOLDER_NAME',
			accountHolderName,
		}))(dispatch, getState);
	};

const sendFormSubmitEventForPayPalRecurring =
	() =>
	(dispatch: Dispatch, getState: () => State): void => {
		const state = getState();
		const formSubmitParameters: FormSubmitParameters = {
			...state.page.form,
			flowPrefix: 'npf',
			form: getForm('form--contribution'),
			isSignedIn: state.page.user.isSignedIn,
			setCheckoutFormHasBeenSubmitted: () =>
				void dispatch(setCheckoutFormHasBeenSubmitted()),
		};
		onFormSubmit(formSubmitParameters);
	};

const stripeOneOffRecaptchaToken = (state: State): string => {
	if (state.page.user.isPostDeploymentTestUser) {
		return 'post-deploy-token';
	}

	// see https://github.com/guardian/payment-api/pull/195
	return state.page.form.oneOffRecaptchaToken ?? '';
};

const buildStripeChargeDataFromAuthorisation = (
	stripePaymentMethod: StripePaymentMethod,
	state: State,
): StripeChargeData => ({
	paymentData: {
		currency: state.common.internationalisation.currencyId,
		amount: getAmount(
			state.page.form.selectedAmounts,
			state.page.form.formData.otherAmounts,
			state.page.form.contributionType,
		),
		email: state.page.form.formData.email ?? '',
		stripePaymentMethod,
	},
	acquisitionData: derivePaymentApiAcquisitionData(
		state.common.referrerAcquisitionData,
		state.common.abParticipations,
	),
	publicKey: getStripeKey(
		stripeAccountForContributionType[state.page.form.contributionType],
		state.common.internationalisation.countryId,
		state.page.user.isTestUser ?? false,
	),
	recaptchaToken: stripeOneOffRecaptchaToken(state),
});

const stripeChargeDataFromPaymentIntentAuthorisation = (
	authorisation: StripePaymentIntentAuthorisation,
	state: State,
): StripeChargeData =>
	buildStripeChargeDataFromAuthorisation(
		authorisation.stripePaymentMethod,
		state,
	);

function getBillingCountryAndState(
	authorisation: PaymentAuthorisation,
	state: State,
): {
	billingCountry: IsoCountry;
	billingState: Option<StateProvince>;
} {
	const pageBaseCountry = state.common.internationalisation.countryId; // Needed later

	// If the user chose a Direct Debit payment method, then we must use the pageBaseCountry as the billingCountry.
	if (
		[DirectDebit, ExistingDirectDebit].includes(authorisation.paymentMethod)
	) {
		const { billingState } = state.page.form.formData;
		return {
			billingCountry: pageBaseCountry,
			billingState,
		};
	}

	// If the page form has a billingCountry, then it must have been provided by a wallet, ApplePay or
	// Payment Request Button, which will already have filtered the billingState by stateProvinceFromString,
	// so we can trust both values, verbatim.
	if (state.page.form.formData.billingCountry) {
		const { billingCountry, billingState } = state.page.form.formData;
		return {
			billingCountry,
			billingState,
		};
	}

	// If we have a billingState but no billingCountry then the state must have come from the drop-down on the website,
	// wherupon it must match with the page's base country.
	if (
		state.page.form.formData.billingState &&
		!state.page.form.formData.billingCountry
	) {
		return {
			billingCountry: pageBaseCountry,
			billingState: stateProvinceFromString(
				pageBaseCountry,
				state.page.form.formData.billingState,
			),
		};
	}

	// Else, it's not a wallet transaction, and it's a no-state checkout page, so the only other option is to determine
	// the country and state from GEO-IP, and failing that, the page's base country, ultimately from the countryGroup
	// (e.g. DE for Europe, IN for International, GB for United Kingdom).
	const billingCountry =
		findIsoCountry(window.guardian.geoip?.countryCode) ?? pageBaseCountry;
	const billingState = stateProvinceFromString(
		billingCountry,
		window.guardian.geoip?.stateCode,
	);
	return {
		billingCountry,
		billingState,
	};
}

function regularPaymentRequestFromAuthorisation(
	authorisation: PaymentAuthorisation,
	state: State,
): RegularPaymentRequest {
	const { billingCountry, billingState } = getBillingCountryAndState(
		authorisation,
		state,
	);
	return {
		firstName: (state.page.form.formData.firstName ?? '').trim(),
		lastName: (state.page.form.formData.lastName ?? '').trim(),
		email: (state.page.form.formData.email ?? '').trim(),
		billingAddress: {
			lineOne: null,
			// required go cardless field
			lineTwo: null,
			// required go cardless field
			city: null,
			// required go cardless field
			state: billingState,
			// required Zuora field if country is US or CA
			postCode: null,
			// required go cardless field
			country: billingCountry, // required Zuora field
		},
		product: {
			productType: 'Contribution',
			amount: getAmount(
				state.page.form.selectedAmounts,
				state.page.form.formData.otherAmounts,
				state.page.form.contributionType,
			),
			currency: state.common.internationalisation.currencyId,
			billingPeriod:
				state.page.form.contributionType === 'MONTHLY' ? Monthly : Annual,
		},
		firstDeliveryDate: null,
		paymentFields: regularPaymentFieldsFromAuthorisation(authorisation),
		ophanIds: getOphanIds(),
		referrerAcquisitionData: state.common.referrerAcquisitionData,
		supportAbTests: getSupportAbTests(state.common.abParticipations),
		telephoneNumber: null,
		debugInfo: 'contributions does not collect redux state',
	};
}

const amazonPayDataFromAuthorisation = (
	authorisation: AmazonPayAuthorisation,
	state: State,
): AmazonPayData => ({
	paymentData: {
		currency: state.common.internationalisation.currencyId,
		amount: getAmount(
			state.page.form.selectedAmounts,
			state.page.form.formData.otherAmounts,
			state.page.form.contributionType,
		),
		orderReferenceId: authorisation.orderReferenceId ?? '',
		email: state.page.form.formData.email ?? '',
	},
	acquisitionData: derivePaymentApiAcquisitionData(
		state.common.referrerAcquisitionData,
		state.common.abParticipations,
	),
});

// A PaymentResult represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// This will execute at the end of every checkout, with the exception
// of PayPal one-off where this happens on the backend after the user is redirected to our site.
const onPaymentResult =
	(
		paymentResult: Promise<PaymentResult>,
		paymentAuthorisation: PaymentAuthorisation,
	) =>
	(dispatch: Dispatch<Action>, getState: () => State): Promise<PaymentResult> =>
		paymentResult.then((result) => {
			const state = getState();

			switch (result.paymentStatus) {
				case 'success':
					trackConversion(
						state.common.abParticipations,
						'/contribute/thankyou',
					);
					dispatch(paymentSuccess());
					break;

				case 'failure':
				default: {
					// Payment Request button has its own error message, separate from the form
					const isPaymentRequestButton =
						paymentAuthorisation.paymentMethod == Stripe &&
						(paymentAuthorisation.stripePaymentMethod ===
							'StripePaymentRequestButton' ||
							paymentAuthorisation.stripePaymentMethod === 'StripeApplePay');

					if (isPaymentRequestButton && result.error) {
						dispatch(
							setStripePaymentRequestButtonError(
								result.error,
								stripeAccountForContributionType[
									state.page.form.contributionType
								],
							),
						);
					} else {
						if (paymentAuthorisation.paymentMethod === 'AmazonPay') {
							if (
								result.error === 'amazon_pay_try_other_card' ||
								result.error === 'amazon_pay_try_again'
							) {
								// Must re-render the wallet widget in order to display amazon's error message
								dispatch(setAmazonPayWalletIsStale(true));
							} else {
								// Disable Amazon Pay
								dispatch(setAmazonPayFatalError);
							}
						}

						// Reset any updates the previous payment method had made to the form's billingCountry or billingState
						dispatch(updateBillingCountry(null));
						updateBillingState(null)(dispatch, getState);
						// Finally, trigger the form display
						if (result.error) {
							dispatch(paymentFailure(result.error));
						}
					}

					dispatch(paymentWaiting(false));
				}
			}

			return result;
		});

const onCreateOneOffPayPalPaymentResponse =
	(paymentResult: Promise<CreatePayPalPaymentResponse>) =>
	(dispatch: Dispatch<Action>, getState: () => State): void => {
		void paymentResult.then((result: CreatePayPalPaymentResponse) => {
			const state = getState();
			const acquisitionData = derivePaymentApiAcquisitionData(
				state.common.referrerAcquisitionData,
				state.common.abParticipations,
			);
			// We've only created a payment at this point, and the user has to get through
			// the PayPal flow on their site before we can actually try and execute the payment.
			// So we drop a cookie which will be used by the /paypal/rest/return endpoint
			// that the user returns to from PayPal, if payment is successful.
			cookie.set(
				'acquisition_data',
				encodeURIComponent(JSON.stringify(acquisitionData)),
			);

			if (result.type === 'success') {
				window.location.href = result.data.approvalUrl;
			} else {
				// For PayPal create payment errors, the Payment API passes through the
				// error from PayPal's API which we don't want to expose to the user.
				dispatch(paymentFailure('unknown'));
				dispatch(paymentWaiting(false));
			}
		});
	};

// The steps for one-off payment can be summarised as follows:
// 1. Create a payment
// 2. Authorise a payment
// 3. Execute a payment (money is actually taken at this point)
//
// For PayPal: we do 1 clientside, they do 2, we do 3 but serverside
// For Stripe: they do 1 & 2, we do 3 clientside.
//
// So from the clientside perspective, for one-off we just see "create payment" for PayPal
// and "execute payment" for Stripe, and these are not synonymous.
const createOneOffPayPalPayment =
	(data: CreatePaypalPaymentData) =>
	(dispatch: Dispatch<Action>, getState: () => State): void => {
		onCreateOneOffPayPalPaymentResponse(
			postOneOffPayPalCreatePaymentRequest(data),
		)(dispatch, getState);
	};

const makeCreateStripePaymentIntentRequest =
	(
		data: CreateStripePaymentIntentRequest,
		handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>,
		paymentAuthorisation: PaymentAuthorisation,
	) =>
	(dispatch: Dispatch<Action>, getState: () => State): Promise<PaymentResult> =>
		onPaymentResult(
			processStripePaymentIntentRequest(data, handleStripe3DS),
			paymentAuthorisation,
		)(dispatch, getState);

const executeAmazonPayOneOffPayment =
	(data: AmazonPayData, paymentAuthorisation: PaymentAuthorisation) =>
	(dispatch: Dispatch<Action>, getState: () => State): Promise<PaymentResult> =>
		onPaymentResult(
			postOneOffAmazonPayExecutePaymentRequest(data),
			paymentAuthorisation,
		)(dispatch, getState);

function recurringPaymentAuthorisationHandler(
	dispatch: Dispatch<Action>,
	state: State,
	paymentAuthorisation: PaymentAuthorisation,
): Promise<PaymentResult> {
	const request = regularPaymentRequestFromAuthorisation(
		paymentAuthorisation,
		state,
	);
	return onPaymentResult(
		postRegularPaymentRequest(
			routes.recurringContribCreate,
			request,
			state.common.abParticipations,
			state.page.csrf,
		),
		paymentAuthorisation,
	)(dispatch, () => state);
}

// Bizarrely, adding a type to this object means the type-checking on the
// paymentAuthorisationHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const recurringPaymentAuthorisationHandlers = {
	// These are all the same because there's a single endpoint in
	// support-frontend which handles all requests to create a recurring payment
	PayPal: recurringPaymentAuthorisationHandler,
	Stripe: recurringPaymentAuthorisationHandler,
	DirectDebit: recurringPaymentAuthorisationHandler,
	Sepa: recurringPaymentAuthorisationHandler,
	ExistingCard: recurringPaymentAuthorisationHandler,
	ExistingDirectDebit: recurringPaymentAuthorisationHandler,
	AmazonPay: recurringPaymentAuthorisationHandler,
};
const error: PaymentResult = {
	paymentStatus: 'failure',
	error: 'internal_error',
};
const paymentAuthorisationHandlers: PaymentMatrix<
	(
		dispatch: Dispatch<Action>,
		state: State,
		paymentAuthorisation: PaymentAuthorisation,
	) => Promise<PaymentResult>
> = {
	ONE_OFF: {
		PayPal: () => {
			// Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
			// endpoint, after PayPal redirects the browser back to our site.
			logException('Paypal one-off has no authorisation handler');
			return Promise.resolve(error);
		},
		Stripe: (
			dispatch: Dispatch<Action>,
			state: State,
			paymentAuthorisation: PaymentAuthorisation,
		): Promise<PaymentResult> => {
			if (paymentAuthorisation.paymentMethod === Stripe) {
				if (paymentAuthorisation.paymentMethodId) {
					const { handle3DS } = state.page.form.stripeCardFormData;

					if (handle3DS) {
						const stripeData: CreateStripePaymentIntentRequest = {
							...stripeChargeDataFromPaymentIntentAuthorisation(
								paymentAuthorisation,
								state,
							),
							paymentMethodId: paymentAuthorisation.paymentMethodId,
						};
						return makeCreateStripePaymentIntentRequest(
							stripeData,
							handle3DS,
							paymentAuthorisation,
						)(dispatch, () => state);
					}

					// It shouldn't be possible to get this far without the handle3DS having been set
					logException('Stripe 3DS handler unavailable');
					return Promise.resolve(error);
				}

				logException(
					'Invalid payment authorisation: missing paymentMethodId for Stripe one-off contribution',
				);
				return Promise.resolve(error);
			}

			logException(
				`Invalid payment authorisation: Tried to use the ${paymentAuthorisation.paymentMethod} handler with Stripe`,
			);
			return Promise.resolve(error);
		},
		DirectDebit: () => {
			logInvalidCombination('ONE_OFF', DirectDebit);
			return Promise.resolve(error);
		},
		Sepa: () => {
			logInvalidCombination('ONE_OFF', Sepa);
			return Promise.resolve(error);
		},
		ExistingCard: () => {
			logInvalidCombination('ONE_OFF', ExistingCard);
			return Promise.resolve(error);
		},
		ExistingDirectDebit: () => {
			logInvalidCombination('ONE_OFF', ExistingDirectDebit);
			return Promise.resolve(error);
		},
		AmazonPay: (
			dispatch: Dispatch<Action>,
			state: State,
			paymentAuthorisation: PaymentAuthorisation,
		): Promise<PaymentResult> => {
			if (
				paymentAuthorisation.paymentMethod === AmazonPay &&
				paymentAuthorisation.orderReferenceId !== undefined
			) {
				return executeAmazonPayOneOffPayment(
					amazonPayDataFromAuthorisation(paymentAuthorisation, state),
					paymentAuthorisation,
				)(dispatch, () => state);
			}

			return Promise.resolve(error);
		},
		None: () => {
			logInvalidCombination('ONE_OFF', 'None');
			return Promise.resolve(error);
		},
	},
	ANNUAL: {
		...recurringPaymentAuthorisationHandlers,
		None: () => {
			logInvalidCombination('ANNUAL', 'None');
			return Promise.resolve(error);
		},
	},
	MONTHLY: {
		...recurringPaymentAuthorisationHandlers,
		None: () => {
			logInvalidCombination('MONTHLY', 'None');
			return Promise.resolve(error);
		},
	},
};

const onThirdPartyPaymentAuthorised =
	(paymentAuthorisation: PaymentAuthorisation) =>
	(dispatch: Dispatch, getState: () => State): Promise<PaymentResult> => {
		const state = getState();
		return paymentAuthorisationHandlers[state.page.form.contributionType][
			state.page.form.paymentMethod
		](dispatch, state, paymentAuthorisation);
	};

export {
	updateContributionTypeAndPaymentMethod,
	updatePaymentMethod,
	updateSelectedExistingPaymentMethod,
	updateFirstName,
	updateLastName,
	updateEmail,
	updateBillingState,
	updateBillingCountry,
	updateUserFormData,
	setAmazonPayHasBegunLoading,
	setAmazonPayLoginObject,
	setAmazonPayPaymentsObject,
	setAmazonPayWalletIsStale,
	setAmazonPayHasAccessToken,
	setAmazonPayFatalError,
	setAmazonPayOrderReferenceId,
	setAmazonPayBillingAgreementId,
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayPaymentSelected,
	setUserTypeFromIdentityResponse,
	selectAmount,
	selectAmounts,
	updateOtherAmount,
	paymentFailure,
	paymentWaiting,
	paymentSuccess,
	onThirdPartyPaymentAuthorised,
	setCheckoutFormHasBeenSubmitted,
	createOneOffPayPalPayment,
	getUserType,
	setFormIsValid,
	sendFormSubmitEventForPayPalRecurring,
	setStripePaymentRequestButtonClicked,
	setStripePaymentRequestButtonError,
	setTickerGoalReached,
	setCreateStripePaymentMethod,
	setHandleStripe3DS,
	setStripeCardFormComplete,
	setStripeSetupIntentClientSecret,
	setStripeRecurringRecaptchaVerified,
	setPayPalHasBegunLoading,
	updatePayPalButtonReady,
	updateRecaptchaToken,
	loadPayPalExpressSdk,
	loadAmazonPaySdk,
	setSepaIban,
	setSepaAccountHolderName,
};
