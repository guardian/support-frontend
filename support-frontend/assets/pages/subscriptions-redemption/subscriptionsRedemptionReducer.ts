// ----- Imports ----- //
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { ReaderType } from 'helpers/productPrice/readerType';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import { getInitialState } from 'helpers/redux/utils/setup';
import { renderError } from 'helpers/rendering/render';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { getUser } from 'helpers/user/user';
import type { User } from 'helpers/user/userReducer';
import { createUserReducer } from 'helpers/user/userReducer';

export type Stage = 'form' | 'processing' | 'thankyou' | 'thankyou-pending';

export type RedemptionCheckoutState = {
	stage: Stage;
	firstName: string;
	lastName: string;
	email: string;
	confirmEmail: string;
	telephone: string;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	errors: Array<FormError<FormField>>;
};

export type RedemptionFormState = {
	userCode: Option<string>;
	readerType: Option<ReaderType>;
	error: Option<string>;
	user: User;
	csrf: Csrf;
	marketingConsent: MarketingConsentState;
	checkout: RedemptionCheckoutState;
};

// ------- Actions ---------- //
export type Action =
	| {
			type: 'SET_STAGE';
			stage: Stage;
	  }
	| {
			type: 'SET_USER_CODE';
			userCode: string;
	  }
	| {
			type: 'SET_READER_TYPE';
			readerType: Option<ReaderType>;
	  }
	| {
			type: 'SET_ERROR';
			error: Option<string>;
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
			type: 'SET_TELEPHONE';
			telephone: string;
	  }
	| {
			type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE';
			userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	  }
	| {
			type: 'SET_FORM_ERRORS';
			errors: Array<FormError<FormField>>;
	  };

function createRedemptionCheckoutReducer() {
	const user = getUser();

	const initialState: RedemptionCheckoutState = {
		stage: getGlobal('stage') ?? 'form',
		firstName: user.firstName ?? '',
		lastName: user.lastName ?? '',
		email: user.email ?? '',
		confirmEmail: '',
		telephone: '',
		userTypeFromIdentityResponse: 'noRequestSent',
		isSignedIn: user.isSignedIn,
		errors: [],
	};

	const redemptionCheckoutReducer = (
		previousState: RedemptionCheckoutState = initialState,
		action: Action,
	): RedemptionCheckoutState => {
		switch (action.type) {
			case 'SET_STAGE':
				return {
					...previousState,
					stage: action.stage,
				};

			case 'SET_FIRST_NAME':
				return {
					...previousState,
					firstName: action.firstName,
				};

			case 'SET_LAST_NAME':
				return {
					...previousState,
					lastName: action.lastName,
				};

			case 'SET_EMAIL':
				return {
					...previousState,
					email: action.email,
				};

			case 'SET_CONFIRM_EMAIL':
				return {
					...previousState,
					confirmEmail: action.email,
				};

			case 'SET_TELEPHONE':
				return {
					...previousState,
					telephone: action.telephone,
				};

			case 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE':
				return {
					...previousState,
					userTypeFromIdentityResponse: action.userTypeFromIdentityResponse,
				};
			case 'SET_FORM_ERRORS':
				return {
					...previousState,
					errors: action.errors,
				};

			default:
				return previousState;
		}
	};

	return redemptionCheckoutReducer;
}

const userCode = (
	previousState: Option<string> = getGlobal('userCode'),
	action: Action,
) => {
	switch (action.type) {
		case 'SET_USER_CODE':
			return action.userCode;

		default:
			return previousState;
	}
};

const readerType = (
	previousState: Option<ReaderType> = getGlobal('readerType'),
	action: Action,
) => {
	switch (action.type) {
		case 'SET_READER_TYPE':
			return action.readerType;

		default:
			return previousState;
	}
};

const error = (
	previousState: Option<string> = getGlobal('error'),
	action: Action,
) => {
	switch (action.type) {
		case 'SET_ERROR':
			return action.error;

		default:
			return previousState;
	}
};

const marketingConsent = marketingConsentReducerFor('MARKETING_CONSENT');

const redemptionPageReducer = combineReducers({
	userCode,
	readerType,
	error,
	csrf,
	user: createUserReducer(),
	marketingConsent,
	checkout: createRedemptionCheckoutReducer(),
});

const baseReducer = {
	common: commonReducer,
	page: redemptionPageReducer,
};

export const redemptionStore = configureStore({
	reducer: baseReducer,
});

export type RedemptionStore = typeof redemptionStore;

export function initReduxForRedemption(): RedemptionStore {
	try {
		const initialState = getInitialState();
		redemptionStore.dispatch(setInitialCommonState(initialState));

		return redemptionStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type RedemptionPageState = ReturnType<typeof redemptionStore.getState>;

export type RedemptionDispatch = typeof redemptionStore.dispatch;
