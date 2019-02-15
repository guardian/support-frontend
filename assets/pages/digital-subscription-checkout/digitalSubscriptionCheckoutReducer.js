// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';

import { type ReduxState } from 'helpers/page/page';
import { type Option } from 'helpers/types/option';
import { type DigitalBillingPeriod, Monthly } from 'helpers/billingPeriods';
import { getQueryParameter } from 'helpers/url';
import csrf, { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import {
  fromString,
  type IsoCountry,
  type StateProvince,
  stateProvinceFromString,
} from 'helpers/internationalisation/country';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { setCountry, type Action as CommonAction } from 'helpers/page/commonActions';
import { formError, type FormError, nonEmptyString, notNull, validate } from 'helpers/subscriptionsForms/validation';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { type Action as DDAction } from 'components/directDebit/directDebitActions';
import {
  marketingConsentReducerFor,
  type State as MarketingConsentState,
} from 'components/marketingConsent/marketingConsentReducer';
import { getSignoutUrl } from 'helpers/externalLinks';
import { isTestUser } from 'helpers/user/user';
import type { ErrorReason } from 'helpers/errorReasons';
import { createUserReducer } from 'helpers/user/userReducer';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getUser } from './helpers/user';
import { showPaymentMethod, onPaymentAuthorised, countrySupportsDirectDebit } from './helpers/paymentProviders';

// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';
type PaymentMethod = 'Stripe' | 'DirectDebit';

export type FormFieldsInState = {|
  firstName: string,
  lastName: string,
  addressLine1: string,
  addressLine2: Option<string>,
  townCity: string,
  county: Option<string>,
  postcode: string,
  email: string,
  stateProvince: Option<StateProvince>,
  telephone: Option<string>,
  billingPeriod: DigitalBillingPeriod,
  paymentMethod: Option<PaymentMethod>,
|};

export type FormFields = {|
  ...FormFieldsInState,
  country: IsoCountry,
  countrySupportsDirectDebit: boolean,
|};


export type FormField = $Keys<FormFields>;

type CheckoutState = {|
  stage: Stage,
  ...FormFieldsInState,
  email: string,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  formSubmitted: boolean,
  isTestUser: boolean,
  productPrices: ProductPrices,
|};

export type State = ReduxState<{|
  checkout: CheckoutState,
  csrf: CsrfState,
  marketingConsent: MarketingConsentState,
|}>;

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_ADDRESS_LINE_1', addressLine1: string }
  | { type: 'SET_ADDRESS_LINE_2', addressLine2: string }
  | { type: 'SET_TOWN_CITY', townCity: string }
  | { type: 'SET_COUNTY', county: string }
  | { type: 'SET_COUNTRY', country: string }
  | { type: 'SET_POSTCODE', postcode: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_STATE_PROVINCE', stateProvince: string, country: IsoCountry }
  | { type: 'SET_BILLING_PERIOD', billingPeriod: DigitalBillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod, country: IsoCountry }
  | { type: 'SET_COUNTRY_CHANGED', country: IsoCountry }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | DDAction;


// ----- Selectors ----- //

function getFormFields(state: State): FormFields {
  return {
    firstName: state.page.checkout.firstName,
    email: state.page.checkout.email,
    lastName: state.page.checkout.lastName,
    addressLine1: state.page.checkout.addressLine1,
    addressLine2: state.page.checkout.addressLine2,
    townCity: state.page.checkout.townCity,
    county: state.page.checkout.county,
    postcode: state.page.checkout.postcode,
    country: state.common.internationalisation.countryId,
    stateProvince: state.page.checkout.stateProvince,
    telephone: state.page.checkout.telephone,
    billingPeriod: state.page.checkout.billingPeriod,
    paymentMethod: state.page.checkout.paymentMethod,
    countrySupportsDirectDebit: countrySupportsDirectDebit(state.common.internationalisation.countryId),
  };
}

function getEmail(state: State): string {
  return state.page.checkout.email;
}


// ----- Functions ----- //

function getErrors(fields: FormFields): FormError<FormField>[] {
  return validate([
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a value.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a value.'),
    },
    {
      rule: nonEmptyString(fields.addressLine1),
      error: formError('addressLine1', 'Please enter a value'),
    },
    {
      rule: nonEmptyString(fields.townCity),
      error: formError('townCity', 'Please enter a value'),
    },
    {
      rule: nonEmptyString(fields.postcode),
      error: formError('postcode', 'Please enter a value'),
    },
    {
      rule: notNull(fields.country),
      error: formError('country', 'Please select a country.'),
    },
    {
      rule: fields.country === 'US' || fields.country === 'CA' ? notNull(fields.stateProvince) : true,
      error: formError(
        'stateProvince',
        fields.country === 'CA' ? 'Please select a province/territory.' : 'Please select a state.',
      ),
    },
  ]);
}

// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({ type: 'SET_FORM_ERRORS', errors });
const setSubmissionError = (error: ErrorReason): Action => ({ type: 'SET_SUBMISSION_ERROR', error });
const setFormSubmitted = (formSubmitted: boolean) => ({ type: 'SET_FORM_SUBMITTED', formSubmitted });

const signOut = () => { window.location.href = getSignoutUrl(); };

function submitForm(dispatch: Dispatch<Action>, state: State) {
  const errors = getErrors(getFormFields(state));
  if (errors.length > 0) {
    dispatch(setFormErrors(errors));
  } else {
    showPaymentMethod(dispatch, state);
  }
}

const formActionCreators = {
  setFirstName: (firstName: string): Action => ({ type: 'SET_FIRST_NAME', firstName }),
  setLastName: (lastName: string): Action => ({ type: 'SET_LAST_NAME', lastName }),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setBillingCountry: (countryRaw: string) => (dispatch: Dispatch<Action | CommonAction>) => {
    const country = fromString(countryRaw);
    if (country) {
      dispatch(setCountry(country));
      dispatch({
        type: 'SET_COUNTRY_CHANGED',
        country,
      });
    }
  },
  setStateProvince: (stateProvince: string) =>
    (dispatch: Dispatch<Action>, getState: () => State) => dispatch({
      type: 'SET_STATE_PROVINCE',
      stateProvince,
      country: getState().common.internationalisation.countryId,
    }),
  setAddressLine1: (addressLine1: string): Action => ({ type: 'SET_ADDRESS_LINE_1', addressLine1 }),
  setAddressLine2: (addressLine2: string): Action => ({ type: 'SET_ADDRESS_LINE_2', addressLine2 }),
  setTownCity: (townCity: string): Action => ({ type: 'SET_TOWN_CITY', townCity }),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
  setCounty: (county: string): Action => ({ type: 'SET_COUNTY', county }),
  setPostcode: (postcode: string): Action => ({ type: 'SET_POSTCODE', postcode }),
  setBillingPeriod: (billingPeriod: DigitalBillingPeriod): Action => ({ type: 'SET_BILLING_PERIOD', billingPeriod }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>, getState: () => State) => dispatch({
    type: 'SET_PAYMENT_METHOD',
    paymentMethod,
    country: getState().common.internationalisation.countryId,
  }),
  onPaymentAuthorised: (authorisation: PaymentAuthorisation) =>
    (dispatch: Dispatch<Action>, getState: () => State) => onPaymentAuthorised(authorisation, dispatch, getState()),
  submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) => submitForm(dispatch, getState()),
};

export type FormActionCreators = typeof formActionCreators;

// ----- Reducer ----- //

function initReducer(initialCountry: IsoCountry) {
  const billingPeriodInUrl = getQueryParameter('period');
  const user = getUser(); // TODO: this is unnecessary, it should use the user reducer
  const initialBillingPeriod: DigitalBillingPeriod = billingPeriodInUrl === 'Monthly' || billingPeriodInUrl === 'Annual'
    ? billingPeriodInUrl
    : Monthly;
  const { productPrices } = window.guardian;

  const initialState = {
    stage: 'checkout',
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    addressLine1: '',
    addressLine2: null,
    townCity: '',
    county: '',
    postcode: '',
    stateProvince: null,
    telephone: null,
    billingPeriod: initialBillingPeriod,
    paymentMethod: countrySupportsDirectDebit(initialCountry) ? 'DirectDebit' : 'Stripe',
    formErrors: [],
    submissionError: null,
    formSubmitted: false,
    isTestUser: isTestUser(),
    productPrices,
  };

  function reducer(state: CheckoutState = initialState, action: Action): CheckoutState {

    switch (action.type) {

      case 'SET_STAGE':
        return { ...state, stage: action.stage };

      case 'SET_FIRST_NAME':
        return { ...state, firstName: action.firstName };

      case 'SET_LAST_NAME':
        return { ...state, lastName: action.lastName };

      case 'SET_ADDRESS_LINE_1':
        return { ...state, addressLine1: action.addressLine1 };

      case 'SET_ADDRESS_LINE_2':
        return { ...state, addressLine2: action.addressLine2 };

      case 'SET_TOWN_CITY':
        return { ...state, townCity: action.townCity };

      case 'SET_COUNTY':
        return { ...state, county: action.county };

      case 'SET_POSTCODE':
        return { ...state, postcode: action.postcode };

      case 'SET_TELEPHONE':
        return { ...state, telephone: action.telephone };

      case 'SET_STATE_PROVINCE':
        return { ...state, stateProvince: stateProvinceFromString(action.country, action.stateProvince) };

      case 'SET_BILLING_PERIOD':
        return { ...state, billingPeriod: action.billingPeriod };

      case 'SET_PAYMENT_METHOD':
        return {
          ...state,
          paymentMethod: countrySupportsDirectDebit(action.country) ? action.paymentMethod : 'Stripe',
        };

      case 'SET_COUNTRY_CHANGED':
        return {
          ...state,
          stateProvince: null,
          paymentMethod: countrySupportsDirectDebit(action.country) ? 'DirectDebit' : 'Stripe',
        };

      case 'SET_FORM_ERRORS':
        return { ...state, formErrors: action.errors };

      case 'SET_SUBMISSION_ERROR':
        return { ...state, submissionError: action.error, formSubmitted: false };

      case 'SET_FORM_SUBMITTED':
        return { ...state, formSubmitted: action.formSubmitted };

      default:
        return state;
    }
  }

  return combineReducers({
    checkout: reducer,
    user: createUserReducer(fromCountry(initialCountry) || GBPCountries),
    directDebit,
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


// ----- Export ----- //

export {
  initReducer,
  setStage,
  setFormErrors,
  getFormFields,
  getEmail,
  setSubmissionError,
  setFormSubmitted,
  signOut,
  formActionCreators,
};
