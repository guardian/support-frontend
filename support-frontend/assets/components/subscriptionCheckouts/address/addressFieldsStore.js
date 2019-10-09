// @flow

// ----- Imports ----- //
import { combineReducers, type Dispatch } from 'redux';

import { fromString, type IsoCountry } from 'helpers/internationalisation/country';
import { type SetCountryAction, setCountry } from 'helpers/page/commonActions';
import {
  formError,
  type FormError,
  nonEmptyString,
  notNull,
  removeError,
  validate,
} from 'helpers/subscriptionsForms/validation';
import { type RegularPaymentRequestAddress } from 'helpers/paymentIntegrations/readerRevenueApis';
import { type Scoped } from 'helpers/scoped';

import { type AddressType } from 'helpers/subscriptionsForms/addressType';
import {
  postcodeFinderReducerFor,
  type PostcodeFinderState,
} from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import type { Option } from 'helpers/types/option';
import { setFormSubmissionDependentValue } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import { postcodeIsWithinDeliveryArea } from 'helpers/deliveryCheck';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

// ----- Types ----- //

export type FormFields = {|
  ...RegularPaymentRequestAddress
|};
export type FormField = $Keys<FormFields>;
export type FormErrors = FormError<FormField>[];

type AddressFieldsState = {|
  ...FormFields,
  formErrors: FormErrors,
|}

export type State = {|
  fields: AddressFieldsState,
  postcode: PostcodeFinderState
|};

export type SetCountryChangedAction = { type: 'SET_COUNTRY_CHANGED', country: IsoCountry, ...Scoped<AddressType> };

export type Action =
  | { type: 'SET_ADDRESS_LINE_1', lineOne: string, ...Scoped<AddressType> }
  | { type: 'SET_ADDRESS_LINE_2', lineTwo: string, ...Scoped<AddressType> }
  | { type: 'SET_TOWN_CITY', city: string, ...Scoped<AddressType> }
  | { type: 'SET_STATE', state: string, ...Scoped<AddressType> }
  | SetCountryChangedAction
  | { type: 'SET_ADDRESS_FORM_ERRORS', errors: FormError<FormField>[], ...Scoped<AddressType> }
  | { type: 'SET_POSTCODE', postCode: string, ...Scoped<AddressType> };


// ----- Selectors ----- //

const getPostcodeForm = (state: State): PostcodeFinderState => state.postcode;
const getStateFormErrors = (state: State): FormErrors => state.fields.formErrors;

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

const checkpostCodeLength = (input: string | null): boolean => ((input == null) || (input.length <= 20));

const isStateNullable = (country: Option<IsoCountry>): boolean =>
  country !== 'AU' && country !== 'US' && country !== 'CA';

export const isHomeDeliveryInM25 = (fulfilmentOption: Option<FulfilmentOptions>, postcode: Option<string>) => {
  if (fulfilmentOption === 'HomeDelivery' && postcode !== null) {
    return postcodeIsWithinDeliveryArea(postcode);
  }
  return true;
};

const applyBillingAddressRules = (fields: FormFields, addressType: AddressType): FormError<FormField>[] => validate([
  {
    rule: nonEmptyString(fields.lineOne),
    error: formError('lineOne', `Please enter a ${addressType} address.`),
  },
  {
    rule: nonEmptyString(fields.city),
    error: formError('city', `Please enter a ${addressType} city.`),
  },
  {
    rule: isPostcodeOptional(fields.country) || nonEmptyString(fields.postCode),
    error: formError('postCode', `Please enter a ${addressType} postcode.`),
  },
  {
    rule: checkpostCodeLength(fields.postCode),
    error: formError('postCode', `Please enter a ${addressType} postcode no longer than 20 characters.`),
  },
  {
    rule: notNull(fields.country),
    error: formError('country', `Please select a ${addressType} country.`),
  },
  {
    rule: isStateNullable(fields.country) || (notNull(fields.state) && nonEmptyString(fields.state)),
    error: formError(
      'state',
      fields.country === 'CA' ? `Please select a ${addressType} province/territory.` : `Please select a ${addressType} state.`,
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
      error: formError('postCode', 'Sorry, we cannot deliver a paper to an address with this postcode. Please call Customer Services on: 0330 333 6767 or press Back to purchase a voucher subscription.'),
    },
  ]);

  const billingRules = applyBillingAddressRules(fields, addressType);

  return [...homeRules, ...billingRules];
};

// ----- Action Creators ----- //

const setFormErrorsFor = (scope: AddressType) => (errors: Array<FormError<FormField>>): Action => ({
  scope,
  type: 'SET_ADDRESS_FORM_ERRORS',
  errors,
});

const addressActionCreatorsFor = (scope: AddressType) => ({
  setCountry: (countryRaw: string) => (dispatch: Dispatch<SetCountryChangedAction | SetCountryAction>) => {
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
  setAddressLineOne: (lineOne: string): Function => (setFormSubmissionDependentValue(() => ({
    scope,
    type: 'SET_ADDRESS_LINE_1',
    lineOne,
  }))),
  setAddressLineTwo: (lineTwo: string): Action => ({
    scope,
    type: 'SET_ADDRESS_LINE_2',
    lineTwo,
  }),
  setTownCity: (city: string): Function => (setFormSubmissionDependentValue(() => ({
    scope,
    type: 'SET_TOWN_CITY',
    city,
  }))),
  setState: (state: string): Function => (setFormSubmissionDependentValue(() => ({
    type: 'SET_STATE',
    state,
    scope,
  }))),
  setPostcode: (postCode: string): Function => (setFormSubmissionDependentValue(() => ({
    type: 'SET_POSTCODE',
    postCode,
    scope,
  }))),
});

export type ActionCreators = $Call<typeof addressActionCreatorsFor, AddressType>;

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

  const fields = (state: AddressFieldsState = initialState, action: Action): AddressFieldsState => {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {

      case 'SET_ADDRESS_LINE_1':
        return { ...state, formErrors: removeError('lineOne', state.formErrors), lineOne: action.lineOne };

      case 'SET_ADDRESS_LINE_2':
        return { ...state, lineTwo: action.lineTwo };

      case 'SET_TOWN_CITY':
        return { ...state, formErrors: removeError('city', state.formErrors), city: action.city };

      case 'SET_STATE':
        return { ...state, formErrors: removeError('state', state.formErrors), state: action.state };

      case 'SET_POSTCODE':
        return { ...state, formErrors: removeError('postCode', state.formErrors), postCode: action.postCode };

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
