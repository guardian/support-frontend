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
import { postcodeIsWithinDeliveryArea } from 'components/subscriptionCheckouts/address/deliveryCheck';
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

const isStateNullable = (country: Option<IsoCountry>): boolean =>
  country !== 'AU' && country !== 'US' && country !== 'CA';

export const isHomeDeliveryInM25 = (fulfilmentOption: Option<FulfilmentOptions>, fields) => {
  if (fulfilmentOption === 'HomeDelivery') {
    return postcodeIsWithinDeliveryArea(fields.postCode);
  }
  return true;
};

const setFormErrorsFor = (scope: AddressType) => (errors: Array<FormError<FormField>>): Action => ({
  scope,
  type: 'SET_ADDRESS_FORM_ERRORS',
  errors,
});

const applyAddressRules =
  (fulfilmentOption: Option<FulfilmentOptions>, fields: FormFields): FormError<FormField>[] => validate([
    {
      rule: nonEmptyString(fields.lineOne),
      error: formError('lineOne', 'Please enter an address'),
    },
    {
      rule: nonEmptyString(fields.city),
      error: formError('city', 'Please enter a city'),
    },
    {
      rule: isPostcodeOptional(fields.country) || nonEmptyString(fields.postCode),
      error: formError('postCode', 'Please enter a postcode'),
    },
    {
      rule: isHomeDeliveryInM25(fulfilmentOption, fields),
      error: formError('postCode', 'Sorry, we cannot deliver a paper outside the M25. However you can have vouchers delivered anywhere in the UK. Please switch to vouchers if you would like to continue with this address.'),
    },
    {
      rule: notNull(fields.country),
      error: formError('country', 'Please select a country.'),
    },
    {
      rule: isStateNullable(fields.country) || notNull(fields.state),
      error: formError(
        'state',
        fields.country === 'CA' ? 'Please select a province/territory.' : 'Please select a state.',
      ),
    },
  ]);

// ----- Action Creators ----- //

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
  applyAddressRules,
  setFormErrorsFor,
  addressActionCreatorsFor,
  isPostcodeOptional,
};
