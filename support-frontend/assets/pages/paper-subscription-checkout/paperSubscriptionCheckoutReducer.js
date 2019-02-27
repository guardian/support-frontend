// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';

import { type ReduxState } from 'helpers/page/page';
import { type Option } from 'helpers/types/option';
import csrf, { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { fromString, type IsoCountry } from 'helpers/internationalisation/country';
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
import { type Title } from 'helpers/user/details';
import { getUser } from './helpers/user';
import { postcodeFinderReducer } from './components/postcodeFinderReducer';
import { showPaymentMethod, onPaymentAuthorised, countrySupportsDirectDebit } from './helpers/paymentProviders';

// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';
type PaymentMethod = 'Stripe' | 'DirectDebit';

export type FormFieldsInState = {|
  title: Option<Title>,
  firstName: string,
  lastName: string,
  addressLine1: string,
  addressLine2: Option<string>,
  townCity: string,
  postcode: string,
  email: string,
  startDate: string,
  telephone: Option<string>,
  paymentMethod: Option<PaymentMethod>,
|};

export type FormFields = {|
  ...FormFieldsInState,
  country: IsoCountry,
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
  | { type: 'SET_TITLE', title: Option<Title> }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_ADDRESS_LINE_1', addressLine1: string }
  | { type: 'SET_ADDRESS_LINE_2', addressLine2: string }
  | { type: 'SET_START_DATE', startDate: string }
  | { type: 'SET_TOWN_CITY', townCity: string }
  | { type: 'SET_COUNTY', county: string }
  | { type: 'SET_COUNTRY', country: string }
  | { type: 'SET_POSTCODE', postcode: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SET_COUNTRY_CHANGED', country: IsoCountry }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | DDAction;

// ----- Selectors ----- //

function getFormFields(state: State): FormFields {
  return {
    title: state.page.checkout.title,
    firstName: state.page.checkout.firstName,
    email: state.page.checkout.email,
    lastName: state.page.checkout.lastName,
    addressLine1: state.page.checkout.addressLine1,
    addressLine2: state.page.checkout.addressLine2,
    townCity: state.page.checkout.townCity,
    postcode: state.page.checkout.postcode,
    country: state.common.internationalisation.countryId,
    startDate: state.page.checkout.startDate,
    telephone: state.page.checkout.telephone,
    paymentMethod: state.page.checkout.paymentMethod,
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
      rule: nonEmptyString(fields.startDate),
      error: formError('startDate', 'Please enter a value'),
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
  ]);
}

// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({ type: 'SET_FORM_ERRORS', errors });
const setSubmissionError = (error: ErrorReason): Action => ({ type: 'SET_SUBMISSION_ERROR', error });
const setFormSubmitted = (formSubmitted: boolean) => ({ type: 'SET_FORM_SUBMITTED', formSubmitted });

const signOut = () => {
  window.location.href = getSignoutUrl();
};

function submitForm(dispatch: Dispatch<Action>, state: State) {
  const errors = getErrors(getFormFields(state));
  if (errors.length > 0) {
    dispatch(setFormErrors(errors));
  } else {
    showPaymentMethod(dispatch, state);
  }
}

const formActionCreators = {
  setTitle: (title: string): Action => ({ type: 'SET_TITLE', title }),
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
  setAddressLine1: (addressLine1: string): Action => ({ type: 'SET_ADDRESS_LINE_1', addressLine1 }),
  setAddressLine2: (addressLine2: string): Action => ({ type: 'SET_ADDRESS_LINE_2', addressLine2 }),
  setTownCity: (townCity: string): Action => ({ type: 'SET_TOWN_CITY', townCity }),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
  setCounty: (county: string): Action => ({ type: 'SET_COUNTY', county }),
  setPostcode: (postcode: string): Action => ({ type: 'SET_POSTCODE', postcode }),
  setStartDate: (startDate: string): Action => ({ type: 'SET_START_DATE', startDate }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>) =>
    dispatch({
      type: 'SET_PAYMENT_METHOD',
      paymentMethod,
    }),
  onPaymentAuthorised: (authorisation: PaymentAuthorisation) => (dispatch: Dispatch<Action>) =>
    onPaymentAuthorised(authorisation, dispatch),
  submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) => submitForm(dispatch, getState()),
};

export type FormActionCreators = typeof formActionCreators;

// ----- Reducer ----- //

function initReducer(initialCountry: IsoCountry) {
  const user = getUser(); // TODO: this is unnecessary, it should use the user reducer
  const { productPrices } = window.guardian;

  const initialState = {
    stage: 'checkout',
    title: null,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    addressLine1: '',
    addressLine2: null,
    townCity: '',
    postcode: '',
    startDate: '',
    telephone: null,
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

      case 'SET_TITLE':
        return { ...state, title: action.title };

      case 'SET_LAST_NAME':
        return { ...state, lastName: action.lastName };

      case 'SET_ADDRESS_LINE_1':
        return { ...state, addressLine1: action.addressLine1 };

      case 'SET_ADDRESS_LINE_2':
        return { ...state, addressLine2: action.addressLine2 };

      case 'SET_TOWN_CITY':
        return { ...state, townCity: action.townCity };

      case 'SET_POSTCODE':
        return { ...state, postcode: action.postcode };

      case 'SET_TELEPHONE':
        return { ...state, telephone: action.telephone };

      case 'SET_START_DATE':
        return { ...state, startDate: action.startDate };

      case 'SET_PAYMENT_METHOD':
        return {
          ...state,
          paymentMethod: action.paymentMethod,
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
    postcodeFinder: postcodeFinderReducer,
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
