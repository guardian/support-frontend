// ----- Imports ----- //
import type { Country } from '@guardian/consent-management-platform/dist/types/countries';
import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { AmazonPayData } from 'helpers/forms/paymentIntegrations/amazonPay/types';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import { csrfReducer } from 'helpers/redux/checkout/csrf/reducer';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { marketingConsentReducer } from 'helpers/redux/checkout/marketingConsent/reducer';
import type { MarketingConsentState } from 'helpers/redux/checkout/marketingConsent/state';
import { personalDetailsReducer } from 'helpers/redux/checkout/personalDetails/reducer';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import { productReducer } from 'helpers/redux/checkout/product/reducer';
import type { ProductState } from 'helpers/redux/checkout/product/state';
import { recaptchaReducer } from 'helpers/redux/checkout/recaptcha/reducer';
import type { RecaptchaState } from 'helpers/redux/checkout/recaptcha/state';
import type { CommonState } from 'helpers/redux/commonState/state';
import { createUserReducer } from 'helpers/user/userReducer';
import type { User as UserState } from 'helpers/user/userReducer';
import type { RecentlySignedInExistingPaymentMethod } from '../../helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { Action } from './contributionsLandingActions';

// ----- Types ----- //

export interface UserFormData {
	billingState: string | null;
}

interface FormData extends UserFormData {
	billingState: StateProvince | null;
	billingCountry: IsoCountry | null;
	checkoutFormHasBeenSubmitted: boolean;
}

export interface StripePaymentRequestButtonData {
	stripePaymentRequestButtonClicked: boolean;
	paymentError: ErrorReason | null;
}

export interface StripeCardFormData {
	formComplete: boolean;
	setupIntentClientSecret: string | null;
	recurringRecaptchaVerified: boolean;
}

export interface PayPalData {
	hasBegunLoading: boolean;
	hasLoaded: boolean;
	buttonReady: boolean;
}

export interface SepaData {
	iban: string | null;
	accountHolderName: string | null;
	streetName?: string;
	country?: Country;
}

interface FormState {
	paymentMethod: PaymentMethod;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	amazonPayData: AmazonPayData;
	payPalData: PayPalData;
	isWaiting: boolean;
	formData: FormData;
	stripePaymentRequestButtonData: {
		ONE_OFF: StripePaymentRequestButtonData;
		REGULAR: StripePaymentRequestButtonData;
	};
	stripeCardFormData: StripeCardFormData;
	sepaData: SepaData;
	paymentComplete: boolean;
	paymentError: ErrorReason | null;
	hasSeenDirectDebitThankYouCopy: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	formIsValid: boolean;
	formIsSubmittable: boolean;
	tickerGoalReached: boolean;
	oneOffRecaptchaToken: string | null;
}

interface PageState {
	form: FormState;
	checkoutForm: {
		personalDetails: PersonalDetailsState;
		product: ProductState;
		marketingConsent: MarketingConsentState;
		csrf: CsrfState;
		recaptcha: RecaptchaState;
	};
	user: UserState;
	directDebit: DirectDebitState;
}

export interface State {
	common: CommonState;
	page: PageState;
}

// ----- Functions ----- //

function createFormReducer() {
	// ----- Initial state ----- //
	const initialState: FormState = {
		paymentMethod: 'None',
		amazonPayData: {
			hasBegunLoading: false,
			walletIsStale: false,
			orderReferenceId: null,
			paymentSelected: false,
			hasAccessToken: false,
			fatalError: false,
			amazonBillingAgreementConsentStatus: false,
		},
		payPalData: {
			hasBegunLoading: false,
			hasLoaded: false,
			buttonReady: false,
		},
		formData: {
			billingState: null,
			billingCountry: null,
			checkoutFormHasBeenSubmitted: false,
		},
		stripePaymentRequestButtonData: {
			ONE_OFF: {
				stripePaymentRequestButtonClicked: false,
				paymentError: null,
			},
			REGULAR: {
				stripePaymentRequestButtonClicked: false,
				paymentError: null,
			},
		},
		stripeCardFormData: {
			formComplete: false,
			setupIntentClientSecret: null,
			recurringRecaptchaVerified: false,
		},
		sepaData: {
			iban: null,
			accountHolderName: null,
			country: undefined,
			streetName: undefined,
		},
		isWaiting: false,
		paymentComplete: false,
		paymentError: null,
		hasSeenDirectDebitThankYouCopy: false,
		userTypeFromIdentityResponse: 'noRequestSent',
		formIsValid: true,
		formIsSubmittable: true,
		tickerGoalReached: false,
		oneOffRecaptchaToken: null,
	};
	return function formReducer(
		state: FormState = initialState,
		action: Action,
	): FormState {
		switch (action.type) {
			case 'UPDATE_PAYMENT_METHOD':
				return { ...state, paymentMethod: action.paymentMethod };

			case 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD':
				return {
					...state,
					existingPaymentMethod: action.existingPaymentMethod,
				};

			case 'SET_AMAZON_PAY_HAS_BEGUN_LOADING':
				return {
					...state,
					amazonPayData: { ...state.amazonPayData, hasBegunLoading: true },
				};

			case 'SET_AMAZON_PAY_WALLET_IS_STALE':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						walletIsStale: action.isStale,
					},
				};

			case 'SET_AMAZON_PAY_ORDER_REFERENCE_ID':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						orderReferenceId: action.orderReferenceId,
					},
				};

			case 'SET_AMAZON_PAY_PAYMENT_SELECTED':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						paymentSelected: action.paymentSelected,
					},
				};

			case 'SET_AMAZON_PAY_HAS_ACCESS_TOKEN':
				return {
					...state,
					amazonPayData: { ...state.amazonPayData, hasAccessToken: true },
				};

			case 'SET_AMAZON_PAY_FATAL_ERROR':
				return {
					...state,
					amazonPayData: { ...state.amazonPayData, fatalError: true },
				};

			case 'SET_AMAZON_PAY_BILLING_AGREEMENT_ID':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						amazonBillingAgreementId: action.amazonBillingAgreementId,
					},
				};

			case 'SET_AMAZON_PAY_BILLING_AGREEMENT_CONSENT_STATUS':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						amazonBillingAgreementConsentStatus:
							action.amazonBillingAgreementConsentStatus,
					},
				};

			case 'SET_STRIPE_CARD_FORM_COMPLETE':
				return {
					...state,
					stripeCardFormData: {
						...state.stripeCardFormData,
						formComplete: action.isComplete,
					},
				};

			case 'SET_STRIPE_SETUP_INTENT_CLIENT_SECRET':
				return {
					...state,
					stripeCardFormData: {
						...state.stripeCardFormData,
						setupIntentClientSecret: action.setupIntentClientSecret,
					},
				};

			case 'SET_STRIPE_RECURRING_RECAPTCHA_VERIFIED':
				return {
					...state,
					stripeCardFormData: {
						...state.stripeCardFormData,
						recurringRecaptchaVerified: action.recaptchaVerified,
					},
				};

			case 'SET_SEPA_IBAN':
				return { ...state, sepaData: { ...state.sepaData, iban: action.iban } };

			case 'SET_SEPA_ACCOUNT_HOLDER_NAME':
				return {
					...state,
					sepaData: {
						...state.sepaData,
						accountHolderName: action.accountHolderName,
					},
				};

			case 'SET_SEPA_ADDRESS_STREET_NAME':
				return {
					...state,
					sepaData: {
						...state.sepaData,
						streetName: action.addressStreetName,
					},
				};

			case 'SET_SEPA_ADDRESS_COUNTRY':
				return {
					...state,
					sepaData: {
						...state.sepaData,
						country: action.addressCountry,
					},
				};

			case 'UPDATE_RECAPTCHA_TOKEN':
				return { ...state, oneOffRecaptchaToken: action.recaptchaToken };

			case 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE':
				return {
					...state,
					userTypeFromIdentityResponse: action.userTypeFromIdentityResponse,
				};

			case 'UPDATE_BILLING_STATE':
				return {
					...state,
					formData: { ...state.formData, billingState: action.billingState },
				};

			case 'UPDATE_BILLING_COUNTRY':
				return {
					...state,
					formData: {
						...state.formData,
						billingCountry: action.billingCountry,
					},
				};

			case 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED':
				return {
					...state,
					stripePaymentRequestButtonData: {
						...state.stripePaymentRequestButtonData,
						[action.stripeAccount]: {
							...state.stripePaymentRequestButtonData[action.stripeAccount],
							stripePaymentRequestButtonClicked: true,
						},
					},
				};

			case 'SET_STRIPE_PAYMENT_REQUEST_ERROR':
				return {
					...state,
					stripePaymentRequestButtonData: {
						...state.stripePaymentRequestButtonData,
						[action.stripeAccount]: {
							...state.stripePaymentRequestButtonData[action.stripeAccount],
							paymentError: action.paymentError,
						},
					},
				};

			case 'UPDATE_USER_FORM_DATA':
				return {
					...state,
					formData: { ...state.formData, ...action.userFormData },
				};

			case 'SET_PAYPAL_HAS_BEGUN_LOADING':
				return {
					...state,
					payPalData: { ...state.payPalData, hasBegunLoading: true },
				};

			case 'SET_PAYPAL_HAS_LOADED':
				return {
					...state,
					payPalData: { ...state.payPalData, hasLoaded: true },
				};

			case 'UPDATE_PAYPAL_BUTTON_READY':
				return {
					...state,
					payPalData: { ...state.payPalData, buttonReady: action.ready },
				};

			case 'SET_TICKER_GOAL_REACHED':
				return { ...state, tickerGoalReached: true };

			case 'PAYMENT_FAILURE':
				return {
					...state,
					paymentComplete: false,
					paymentError: action.paymentError,
				};

			case 'SET_FORM_IS_VALID':
				return { ...state, formIsValid: action.isValid };

			case 'SET_FORM_IS_SUBMITTABLE':
				return { ...state, formIsSubmittable: action.formIsSubmittable };

			case 'PAYMENT_WAITING':
				return {
					...state,
					paymentComplete: false,
					isWaiting: action.isWaiting,
				};

			case 'PAYMENT_SUCCESS':
				return { ...state, paymentComplete: true };

			case 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED':
				return {
					...state,
					formData: { ...state.formData, checkoutFormHasBeenSubmitted: true },
				};

			case 'SET_HAS_SEEN_DIRECT_DEBIT_THANK_YOU_COPY':
				return { ...state, hasSeenDirectDebitThankYouCopy: true };

			default:
				return state;
		}
	};
}

function initReducer(): Reducer<PageState> {
	return combineReducers({
		form: createFormReducer(),
		checkoutForm: combineReducers({
			personalDetails: personalDetailsReducer,
			product: productReducer,
			marketingConsent: marketingConsentReducer,
			csrf: csrfReducer,
			recaptcha: recaptchaReducer,
		}),
		user: createUserReducer(),
		directDebit,
	});
}

// ----- Reducer ----- //
export { initReducer };
