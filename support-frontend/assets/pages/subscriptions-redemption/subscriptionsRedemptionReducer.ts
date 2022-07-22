// ----- Imports ----- //
import { combineReducers } from '@reduxjs/toolkit';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { ReaderType } from 'helpers/productPrice/readerType';
import { csrfReducer } from 'helpers/redux/checkout/csrf/reducer';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { marketingConsentReducer } from 'helpers/redux/checkout/marketingConsent/reducer';
import type { MarketingConsentState } from 'helpers/redux/checkout/marketingConsent/state';
import { personalDetailsReducer } from 'helpers/redux/checkout/personalDetails/reducer';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import { productReducer } from 'helpers/redux/checkout/product/reducer';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import type { User } from 'helpers/user/userReducer';
import { createUserReducer } from 'helpers/user/userReducer';

export type Stage = 'form' | 'processing' | 'thankyou' | 'thankyou-pending';

export type RedemptionCheckoutState = {
	stage: Stage;
	errors: Array<FormError<FormField>>;
};

export type RedemptionFormState = {
	userCode: Option<string>;
	readerType: Option<ReaderType>;
	error: Option<string>;
	user: User;
	checkout: RedemptionCheckoutState;
	checkoutForm: {
		personalDetails: PersonalDetailsState;
		marketingConsent: MarketingConsentState;
		csrf: CsrfState;
	};
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
			type: 'SET_FORM_ERRORS';
			errors: Array<FormError<FormField>>;
	  };

function createRedemptionCheckoutReducer() {
	const initialState: RedemptionCheckoutState = {
		stage: getGlobal('stage') ?? 'form',
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

export const redemptionPageReducer = combineReducers({
	userCode,
	readerType,
	error,
	user: createUserReducer(),
	checkout: createRedemptionCheckoutReducer(),
	checkoutForm: combineReducers({
		personalDetails: personalDetailsReducer,
		product: productReducer,
		marketingConsent: marketingConsentReducer,
		csrf: csrfReducer,
	}),
});
