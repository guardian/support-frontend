// ----- Imports ----- //
import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { billingAddressReducer } from 'helpers/redux/checkout/address/reducer';
import type { AddressState } from 'helpers/redux/checkout/address/state';
import { addressMetaReducer } from 'helpers/redux/checkout/addressMeta/reducer';
import type { AddressMetaState } from 'helpers/redux/checkout/addressMeta/state';
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
import { thankYouReducer } from 'helpers/redux/checkout/thankYouState/reducer';
import type { ThankYouState } from 'helpers/redux/checkout/thankYouState/state';
import { userReducer } from 'helpers/redux/user/reducer';
import type { UserState } from 'helpers/redux/user/state';
import type { Action } from './legacyActionCreators';

// ----- Types ----- //

interface FormState {
	isWaiting: boolean;
	paymentComplete: boolean;
	paymentError: ErrorReason | null;
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
		addressMeta: AddressMetaState;
		thankYou: ThankYouState;
	};
	user: UserState;
}

// ----- Functions ----- //

const initialState: FormState = {
	isWaiting: false,
	paymentComplete: false,
	paymentError: null,
};
function formReducer(
	state: FormState = initialState,
	action: Action,
): FormState {
	switch (action.type) {
		case 'PAYMENT_FAILURE':
			return {
				...state,
				paymentComplete: false,
				paymentError: action.paymentError,
			};

		case 'PAYMENT_WAITING':
			return {
				...state,
				paymentComplete: false,
				isWaiting: action.isWaiting,
			};

		case 'PAYMENT_SUCCESS':
			return { ...state, paymentComplete: true };

		default:
			return state;
	}
}

function initReducer(): Reducer<PageState> {
	return combineReducers({
		form: formReducer,
		checkoutForm: combineReducers({
			personalDetails: personalDetailsReducer,
			product: productReducer,
			marketingConsent: marketingConsentReducer,
			csrf: csrfReducer,
			recaptcha: recaptchaReducer,
			payment: paymentReducer,
			billingAddress: billingAddressReducer,
			addressMeta: addressMetaReducer,
			thankYou: thankYouReducer,
		}),
		user: userReducer,
	});
}

// ----- Reducer ----- //
export { initReducer };
