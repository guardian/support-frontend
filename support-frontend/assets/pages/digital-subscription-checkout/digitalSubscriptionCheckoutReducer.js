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
  billingAddressLine1: string,
  billingAddressLine2: Option<string>,
  billingTownCity: string,
  billingCounty: Option<string>,
  billingPostcode: string,
  email: string,
  billingStateProvince: Option<StateProvince>,
  telephone: Option<string>,
  billingPeriod: DigitalBillingPeriod,
  paymentMethod: Option<PaymentMethod>,
|};

export type FormFields = {|
  ...FormFieldsInState,
  billingCountry: IsoCountry,
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
  | { type: 'SET_BILLING_ADDRESS_LINE_1', billingAddressLine1: string }
  | { type: 'SET_BILLING_ADDRESS_LINE_2', billingAddressLine2: string }
  | { type: 'SET_BILLING_TOWN_CITY', billingTownCity: string }
  | { type: 'SET_BILLING_COUNTY', billingCounty: string }
  | { type: 'SET_BILLING_COUNTRY', billingCountry: string }
  | { type: 'SET_BILLING_POSTCODE', billingPostcode: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_BILLING_STATE_PROVINCE', billingStateProvince: string, billingCountry: IsoCountry }
  | { type: 'SET_BILLING_PERIOD', billingPeriod: DigitalBillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod, billingCountry: IsoCountry }
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
    billingAddressLine1: state.page.checkout.billingAddressLine1,
    billingAddressLine2: state.page.checkout.billingAddressLine2,
    billingTownCity: state.page.checkout.billingTownCity,
    billingCounty: state.page.checkout.billingCounty,
    billingPostcode: state.page.checkout.billingPostcode,
    billingCountry: state.common.internationalisation.countryId,
    billingStateProvince: state.page.checkout.billingStateProvince,
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
      rule: nonEmptyString(fields.billingAddressLine1),
      error: formError('billingAddressLine1', 'Please enter a value'),
    },
    {
      rule: nonEmptyString(fields.billingTownCity),
      error: formError('billingTownCity', 'Please enter a value'),
    },
    {
      rule: nonEmptyString(fields.billingPostcode),
      error: formError('billingPostcode', 'Please enter a value'),
    },
    {
      rule: notNull(fields.billingCountry),
      error: formError('billingCountry', 'Please select a country.'),
    },
    {
      rule: fields.billingCountry === 'US' || fields.billingCountry === 'CA' ? notNull(fields.billingCountry) : true,
      error: formError(
        'billingStateProvince',
        fields.billingCountry === 'CA' ? 'Please select a province/territory.' : 'Please select a state.',
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
  setBillingCountryChanged: (countryRaw: string) => (dispatch: Dispatch<Action | CommonAction>) => {
    const country = fromString(countryRaw);
    if (country) {
      dispatch(setCountry(country));
      dispatch({
        type: 'SET_COUNTRY_CHANGED',
        country,
      });
    }
  },
  setBillingStateProvince: (billingStateProvince: string) =>
    (dispatch: Dispatch<Action>, getState: () => State) => dispatch({
      type: 'SET_BILLING_STATE_PROVINCE',
      billingStateProvince,
      billingCountry: getState().common.internationalisation.countryId,
    }),
  setBillingAddressLine1: (billingAddressLine1: string): Action => ({ type: 'SET_BILLING_ADDRESS_LINE_1', billingAddressLine1 }),
  setBillingAddressLine2: (billingAddressLine2: string): Action => ({ type: 'SET_BILLING_ADDRESS_LINE_2', billingAddressLine2 }),
  setBillingTownCity: (billingTownCity: string): Action => ({ type: 'SET_BILLING_TOWN_CITY', billingTownCity }),
  setBillingCountry: (billingCountry: string): Action => ({ type: 'SET_BILLING_COUNTRY', billingCountry }),
  setBillingCounty: (billingCounty: string): Action => ({ type: 'SET_BILLING_COUNTY', billingCounty }),
  setBillingPostcode: (billingPostcode: string): Action => ({ type: 'SET_BILLING_POSTCODE', billingPostcode }),
  setBillingPeriod: (billingPeriod: DigitalBillingPeriod): Action => ({ type: 'SET_BILLING_PERIOD', billingPeriod }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>, getState: () => State) => dispatch({
    type: 'SET_PAYMENT_METHOD',
    paymentMethod,
    billingCountry: getState().common.internationalisation.countryId,
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
    billingAddressLine1: '',
    billingAddressLine2: null,
    billingTownCity: '',
    billingCounty: '',
    billingPostcode: '',
    billingStateProvince: null,
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

      case 'SET_BILLING_ADDRESS_LINE_1':
        return { ...state, billingAddressLine1: action.billingAddressLine1 };

      case 'SET_BILLING_ADDRESS_LINE_2':
        return { ...state, billingAddressLine2: action.billingAddressLine2 };

      case 'SET_BILLING_TOWN_CITY':
        return { ...state, billingTownCity: action.billingTownCity };

      case 'SET_BILLING_COUNTY':
        return { ...state, billingCounty: action.billingCounty };

      case 'SET_BILLING_POSTCODE':
        return { ...state, billingPostcode: action.billingPostcode };

      case 'SET_TELEPHONE':
        return { ...state, telephone: action.telephone };

      case 'SET_BILLING_STATE_PROVINCE':
        return { ...state, billingStateProvince: stateProvinceFromString(action.billingCountry, action.billingStateProvince) };

      case 'SET_BILLING_PERIOD':
        return { ...state, billingPeriod: action.billingPeriod };

      case 'SET_PAYMENT_METHOD':
        return {
          ...state,
          paymentMethod: countrySupportsDirectDebit(action.billingCountry) ? action.paymentMethod : 'Stripe',
        };

      case 'SET_COUNTRY_CHANGED':
        return {
          ...state,
          billingStateProvince: null,
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
