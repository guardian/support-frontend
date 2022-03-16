// ----- Imports ----- //
import type { Country } from '@guardian/consent-management-platform/dist/types/countries';
import type { PaymentIntentResult } from '@stripe/stripe-js';
import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
	ThirdPartyPaymentLibraries,
} from 'helpers/contributions';
import csrf from 'helpers/csrf/csrfReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { getContributionTypeFromSession } from 'helpers/forms/checkouts';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { AmazonPayData } from 'helpers/forms/paymentIntegrations/amazonPay/types';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import type { CommonState } from 'helpers/redux/commonState/state';
import * as storage from 'helpers/storage/storage';
import { createUserReducer } from 'helpers/user/userReducer';
import type { User as UserState } from 'helpers/user/userReducer';
import { marketingConsentReducerFor } from '../../components/marketingConsent/marketingConsentReducer';
import type { State as MarketingConsentState } from '../../components/marketingConsent/marketingConsentReducer';
import type { RecentlySignedInExistingPaymentMethod } from '../../helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { Action } from './contributionsLandingActions';

// ----- Types ----- //

export interface UserFormData {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	billingState: string | null;
}

interface FormData extends UserFormData {
	otherAmounts: OtherAmounts;
	billingState: StateProvince | null;
	billingCountry: IsoCountry | null;
	checkoutFormHasBeenSubmitted: boolean;
}

export interface StripePaymentRequestButtonData {
	stripePaymentRequestButtonClicked: boolean;
	paymentError: ErrorReason | null;
}

export interface Stripe3DSResult {
	error?: Record<string, any>;
	paymentIntent: {
		id: string;
	};
}

export interface StripeCardFormData {
	formComplete: boolean;
	setupIntentClientSecret: string | null;
	recurringRecaptchaVerified: boolean;
	// These callbacks must be initialised after the StripeCardForm component has been created
	createPaymentMethod: ((clientSecret: string | null) => void) | null;
	handle3DS: ((clientSecret: string) => Promise<PaymentIntentResult>) | null; // For single only
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
	contributionType: ContributionType;
	paymentMethod: PaymentMethod;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries;
	// TODO clean up when rest of Stripe Checkout is removed
	amazonPayData: AmazonPayData;
	payPalData: PayPalData;
	selectedAmounts: SelectedAmounts;
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
	user: UserState;
	csrf: CsrfState;
	directDebit: DirectDebitState;
	marketingConsent: MarketingConsentState;
}

export interface State {
	common: CommonState;
	page: PageState;
}

// ----- Functions ----- //

function createFormReducer() {
	// ----- Initial state ----- //
	const initialState: FormState = {
		contributionType: getContributionTypeFromSession() ?? 'MONTHLY',
		paymentMethod: 'None',
		thirdPartyPaymentLibraries: {
			ONE_OFF: {
				Stripe: null,
			},
			MONTHLY: {
				Stripe: null,
			},
			ANNUAL: {
				Stripe: null,
			},
		},
		amazonPayData: {
			hasBegunLoading: false,
			amazonPayLibrary: {
				amazonLoginObject: null,
				amazonPaymentsObject: null,
			},
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
			firstName: null,
			lastName: null,
			email: storage.getSession('gu.email') ?? null,
			otherAmounts: {
				ONE_OFF: {
					amount: null,
				},
				MONTHLY: {
					amount: null,
				},
				ANNUAL: {
					amount: null,
				},
			},
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
			createPaymentMethod: null,
			handle3DS: null,
		},
		sepaData: {
			iban: null,
			accountHolderName: null,
			country: undefined,
			streetName: undefined,
		},
		selectedAmounts: {
			ONE_OFF: 0,
			MONTHLY: 0,
			ANNUAL: 0,
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
			case 'UPDATE_CONTRIBUTION_TYPE':
				return {
					...state,
					contributionType: action.contributionType,
					formData: { ...state.formData },
				};

			case 'UPDATE_PAYMENT_METHOD':
				return { ...state, paymentMethod: action.paymentMethod };

			case 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD':
				return {
					...state,
					existingPaymentMethod: action.existingPaymentMethod,
				};

			case 'UPDATE_PAYMENT_READY':
				return {
					...state,
					thirdPartyPaymentLibraries: {
						ONE_OFF: {
							...state.thirdPartyPaymentLibraries.ONE_OFF,
							...action.thirdPartyPaymentLibraryByContrib.ONE_OFF,
						},
						MONTHLY: {
							...state.thirdPartyPaymentLibraries.MONTHLY,
							...action.thirdPartyPaymentLibraryByContrib.MONTHLY,
						},
						ANNUAL: {
							...state.thirdPartyPaymentLibraries.ANNUAL,
							...action.thirdPartyPaymentLibraryByContrib.ANNUAL,
						},
					},
				};

			case 'SET_AMAZON_PAY_HAS_BEGUN_LOADING':
				return {
					...state,
					amazonPayData: { ...state.amazonPayData, hasBegunLoading: true },
				};

			case 'SET_AMAZON_PAY_LOGIN_OBJECT':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						amazonPayLibrary: {
							...state.amazonPayData.amazonPayLibrary,
							amazonLoginObject: action.amazonLoginObject,
						},
					},
				};

			case 'SET_AMAZON_PAY_PAYMENTS_OBJECT':
				return {
					...state,
					amazonPayData: {
						...state.amazonPayData,
						amazonPayLibrary: {
							...state.amazonPayData.amazonPayLibrary,
							amazonPaymentsObject: action.amazonPaymentsObject,
						},
					},
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

			case 'SET_CREATE_STRIPE_PAYMENT_METHOD':
				return {
					...state,
					stripeCardFormData: {
						...state.stripeCardFormData,
						createPaymentMethod: action.createStripePaymentMethod,
					},
				};

			case 'SET_HANDLE_STRIPE_3DS':
				return {
					...state,
					stripeCardFormData: {
						...state.stripeCardFormData,
						handle3DS: action.handleStripe3DS,
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

			case 'UPDATE_FIRST_NAME':
				return {
					...state,
					formData: { ...state.formData, firstName: action.firstName },
				};

			case 'UPDATE_LAST_NAME':
				return {
					...state,
					formData: { ...state.formData, lastName: action.lastName },
				};

			case 'UPDATE_EMAIL':
				return {
					...state,
					formData: { ...state.formData, email: action.email },
				};

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

			case 'SELECT_AMOUNT':
				return {
					...state,
					selectedAmounts: {
						...state.selectedAmounts,
						[action.contributionType]: action.amount,
					},
				};

			case 'SELECT_AMOUNTS':
				return {
					...state,
					selectedAmounts: {
						...action.amounts,
					},
				};

			case 'UPDATE_OTHER_AMOUNT':
				return {
					...state,
					formData: {
						...state.formData,
						otherAmounts: {
							...state.formData.otherAmounts,
							[action.contributionType]: {
								amount: action.otherAmount,
							},
						},
					},
				};

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
		user: createUserReducer(),
		directDebit,
		csrf,
		marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
	});
}

// ----- Reducer ----- //
export { initReducer };
