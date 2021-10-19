import { $Keys, $Call } from 'utility-types';
// ----- Imports ----- //
import type { Dispatch } from 'redux';
import { combineReducers } from 'redux';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fromString } from 'helpers/internationalisation/country';
import type { SetCountryAction } from 'helpers/page/commonActions';
import { setCountry } from 'helpers/page/commonActions';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import {
	formError,
	nonEmptyString,
	notNull,
	removeError,
	validate,
	nonSillyCharacters,
} from 'helpers/subscriptionsForms/validation';
import type { RegularPaymentRequestAddress } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { Scoped } from 'helpers/subscriptionsForms/scoped';
import 'helpers/subscriptionsForms/scoped';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import 'helpers/subscriptionsForms/addressType';
import type { PostcodeFinderState } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { postcodeFinderReducerFor } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import type { Option } from 'helpers/types/option';
import { setFormSubmissionDependentValue } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import {
	postcodeIsWithinDeliveryArea,
	M25_POSTCODE_PREFIXES,
} from 'helpers/forms/deliveryCheck';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
// ----- Types ----- //
export type FormFields = RegularPaymentRequestAddress;
export type FormField = $Keys<FormFields>;
export type FormErrors = FormError<FormField>[];
type AddressFieldsState = FormFields & {
	formErrors: FormErrors;
};
export type State = {
	fields: AddressFieldsState;
	postcode: PostcodeFinderState;
};
export type SetCountryChangedAction = Scoped<AddressType> & {
	type: 'SET_COUNTRY_CHANGED';
	country: IsoCountry;
};
export type Action =
	| (Scoped<AddressType> & {
			type: 'SET_ADDRESS_LINE_2';
			lineTwo: string;
	  })
	| (Scoped<AddressType> & {
			type: 'SET_ADDRESS_LINE_1';
			lineOne: string;
	  })
	| (Scoped<AddressType> & {
			type: 'SET_TOWN_CITY';
			city: string;
	  })
	| (Scoped<AddressType> & {
			type: 'SET_STATE';
			state: string;
	  })
	| SetCountryChangedAction
	| (Scoped<AddressType> & {
			type: 'SET_ADDRESS_FORM_ERRORS';
			errors: FormError<FormField>[];
	  })
	| (Scoped<AddressType> & {
			type: 'SET_POSTCODE';
			postCode: string;
	  });

// ----- Selectors ----- //
const getPostcodeForm = (state: State): PostcodeFinderState => state.postcode;

const getStateFormErrors = (state: State): FormErrors =>
	state.fields.formErrors;

const getFormFields = (state: State): FormFields => ({
	lineOne: state.fields.lineOne,
	lineTwo: state.fields.lineTwo,
	city: state.fields.city,
	country: state.fields.country,
	postCode: state.fields.postCode,
	state: state.fields.state,
});

// ----- Functions ----- //
const isPostcodeOptional = (country: Option<IsoCountry>): boolean =>
	country !== 'GB' && country !== 'AU' && country !== 'US' && country !== 'CA';

const checkLength = (input: string | null, maxLength: number): boolean =>
	input == null || input.length <= maxLength;

const isStateNullable = (country: Option<IsoCountry>): boolean =>
	country !== 'AU' && country !== 'US' && country !== 'CA';

export const isHomeDeliveryInM25 = (
	fulfilmentOption: Option<FulfilmentOptions>,
	postcode: Option<string>,
	allowedPrefixes: string[] = M25_POSTCODE_PREFIXES,
) => {
	if (fulfilmentOption === 'HomeDelivery' && postcode !== null) {
		return postcodeIsWithinDeliveryArea(postcode, allowedPrefixes);
	}

	return true;
};

const applyBillingAddressRules = (
	fields: FormFields,
	addressType: AddressType,
): FormError<FormField>[] =>
	validate([
		{
			rule: nonEmptyString(fields.lineOne),
			error: formError('lineOne', `Please enter a ${addressType} address.`),
		},
		{
			rule: nonSillyCharacters(fields.lineOne),
			error: formError(
				'lineOne',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: nonSillyCharacters(fields.lineTwo),
			error: formError(
				'lineTwo',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: nonEmptyString(fields.city),
			error: formError('city', `Please enter a ${addressType} city.`),
		},
		{
			rule: nonSillyCharacters(fields.city),
			error: formError(
				'city',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule:
				isPostcodeOptional(fields.country) ||
				(nonEmptyString(fields.postCode) &&
					nonSillyCharacters(fields.postCode)),
			error: formError('postCode', `Please enter a ${addressType} postcode.`),
		},
		{
			rule: nonSillyCharacters(fields.postCode),
			error: formError(
				'postCode',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: checkLength(fields.postCode, 20),
			error: formError(
				'postCode',
				`Please enter a ${addressType} postcode no longer than 20 characters.`,
			),
		},
		{
			rule: notNull(fields.country),
			error: formError('country', `Please select a ${addressType} country.`),
		},
		{
			rule:
				isStateNullable(fields.country) ||
				(notNull(fields.state) && nonEmptyString(fields.state)),
			error: formError(
				'state',
				fields.country === 'CA'
					? `Please select a ${addressType} province/territory.`
					: `Please select a ${addressType} state.`,
			),
		},
		{
			rule: checkLength(fields.state, 40),
			error: formError(
				'state',
				fields.country === 'CA'
					? `Please enter a ${addressType} province/territory no longer than 40 characters`
					: `Please enter a ${addressType} state name no longer than 40 characters`,
			),
		},
	]);

const applyDeliveryAddressRules = (
	fulfilmentOption: Option<FulfilmentOptions>,
	fields: FormFields,
	addressType: AddressType,
): FormError<FormField>[] => {
	const homeRules = validate([
		{
			rule: isHomeDeliveryInM25(fulfilmentOption, fields.postCode),
			error: formError(
				'postCode',
				'The address and postcode you entered is outside of our delivery area. Please go back to purchase a voucher subscription instead.',
			),
		},
	]);
	const billingRules = applyBillingAddressRules(fields, addressType);
	return [...homeRules, ...billingRules];
};

// ----- Action Creators ----- //
const setFormErrorsFor =
	(scope: AddressType) =>
	(errors: Array<FormError<FormField>>): Action => ({
		scope,
		type: 'SET_ADDRESS_FORM_ERRORS',
		errors,
	});

const addressActionCreatorsFor = (scope: AddressType) => ({
	setCountry:
		(countryRaw: string) =>
		(dispatch: Dispatch<SetCountryChangedAction | SetCountryAction>) => {
			const country = fromString(countryRaw);

			if (country) {
				dispatch(setCountry(country));
				dispatch({
					type: 'SET_COUNTRY_CHANGED',
					country,
					scope,
				});
			}
		},
	setAddressLineOne: (lineOne: string): ((...args: Array<any>) => any) =>
		setFormSubmissionDependentValue(() => ({
			scope,
			type: 'SET_ADDRESS_LINE_1',
			lineOne,
		})),
	setAddressLineTwo: (lineTwo: string): Action => ({
		scope,
		type: 'SET_ADDRESS_LINE_2',
		lineTwo,
	}),
	setTownCity: (city: string): ((...args: Array<any>) => any) =>
		setFormSubmissionDependentValue(() => ({
			scope,
			type: 'SET_TOWN_CITY',
			city,
		})),
	setState: (state: string): ((...args: Array<any>) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_STATE',
			state,
			scope,
		})),
	setPostcode: (postCode: string): ((...args: Array<any>) => any) =>
		setFormSubmissionDependentValue(() => ({
			type: 'SET_POSTCODE',
			postCode,
			scope,
		})),
});

export type ActionCreators = $Call<
	typeof addressActionCreatorsFor,
	AddressType
>;

// ----- Reducer ----- //
function addressReducerFor(scope: AddressType, initialCountry: IsoCountry) {
	const initialState = {
		country: initialCountry,
		lineOne: null,
		lineTwo: null,
		city: null,
		postCode: null,
		state: null,
		formErrors: [],
	};

	const fields = (
		state: AddressFieldsState = initialState,
		action: Action,
	): AddressFieldsState => {
		if (action.scope !== scope) {
			return state;
		}

		switch (action.type) {
			case 'SET_ADDRESS_LINE_1':
				return {
					...state,
					formErrors: removeError('lineOne', state.formErrors),
					lineOne: action.lineOne,
				};

			case 'SET_ADDRESS_LINE_2':
				return { ...state, lineTwo: action.lineTwo };

			case 'SET_TOWN_CITY':
				return {
					...state,
					formErrors: removeError('city', state.formErrors),
					city: action.city,
				};

			case 'SET_STATE':
				return {
					...state,
					formErrors: removeError('state', state.formErrors),
					state: action.state,
				};

			case 'SET_POSTCODE':
				return {
					...state,
					formErrors: removeError('postCode', state.formErrors),
					postCode: action.postCode,
				};

			case 'SET_ADDRESS_FORM_ERRORS':
				return { ...state, formErrors: action.errors };

			case 'SET_COUNTRY_CHANGED':
				return {
					...state,
					state: null,
					formErrors: [],
					country: action.country,
				};

			default:
				return state;
		}
	};

	return combineReducers({
		fields,
		postcode: postcodeFinderReducerFor(scope),
	});
}

// ----- Export ----- //
export {
	addressReducerFor,
	getFormFields,
	getStateFormErrors,
	getPostcodeForm,
	setFormErrorsFor,
	addressActionCreatorsFor,
	isPostcodeOptional,
	applyBillingAddressRules,
	applyDeliveryAddressRules,
	isStateNullable,
};
