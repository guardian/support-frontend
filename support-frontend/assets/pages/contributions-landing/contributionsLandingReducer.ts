// ----- Imports ----- //
import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { billingAddressReducer } from 'helpers/redux/checkout/address/reducer';
import type { AddressState } from 'helpers/redux/checkout/address/state';
import { csrfReducer } from 'helpers/redux/checkout/csrf/reducer';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { marketingConsentReducer } from 'helpers/redux/checkout/marketingConsent/reducer';
import type { MarketingConsentState } from 'helpers/redux/checkout/marketingConsent/state';
import type { PaymentState } from 'helpers/redux/checkout/payment/reducer';
import { paymentReducer } from 'helpers/redux/checkout/payment/reducer';
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

interface FormData {
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

interface FormState {
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	isWaiting: boolean;
	formData: FormData;
	paymentComplete: boolean;
	paymentError: ErrorReason | null;
	formIsValid: boolean;
	formIsSubmittable: boolean;
	tickerGoalReached: boolean;
	oneOffRecaptchaToken: string | null;
}

export interface PageState {
	form: FormState;
	checkoutForm: {
		personalDetails: PersonalDetailsState;
		product: ProductState;
		marketingConsent: MarketingConsentState;
		csrf: CsrfState;
		recaptcha: RecaptchaState;
		payment: PaymentState;
		billingAddress: AddressState;
	};
	user: UserState;
}

export interface State {
	common: CommonState;
	page: PageState;
}

// ----- Functions ----- //

function createFormReducer() {
	// ----- Initial state ----- //
	const initialState: FormState = {
		formData: {
			checkoutFormHasBeenSubmitted: false,
		},
		isWaiting: false,
		paymentComplete: false,
		paymentError: null,
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
			case 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD':
				return {
					...state,
					existingPaymentMethod: action.existingPaymentMethod,
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
			payment: paymentReducer,
			billingAddress: billingAddressReducer,
		}),
		user: createUserReducer(),
	});
}

// ----- Reducer ----- //
export { initReducer };
