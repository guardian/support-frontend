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
import { Collection, type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Everyday, type PaperProductOptions } from 'helpers/productPrice/productOptions';
import { type Title } from 'helpers/user/details';
import { getUser } from './helpers/user';
import { showPaymentMethod, onPaymentAuthorised, countrySupportsDirectDebit } from './helpers/paymentProviders';
import { postcodeFinders } from './helpers/postcodeFinders';

// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';
type PaymentMethod = 'Stripe' | 'DirectDebit';

type Product = {|
  fulfilmentOption: PaperFulfilmentOptions,
  productOption: PaperProductOptions,
|};

export type FormFieldsInState = {|
  ...Product,
  title: Option<Title>,
  firstName: string,
  lastName: string,
  billingAddressLine1: string,
  billingAddressLine2: Option<string>,
  billingTownCity: string,
  billingPostcode: string,
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
  billingPostcodeFinder: typeof postcodeFinders.billing.reducer,
  deliveryPostcodeFinder: typeof postcodeFinders.delivery.reducer,
|}>;

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_TITLE', title: Option<Title> }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_BILLING_ADDRESS_LINE_1', billingAddressLine1: string }
  | { type: 'SET_BILLING_ADDRESS_LINE_2', billingAddressLine2: string }
  | { type: 'SET_START_DATE', startDate: string }
  | { type: 'SET_BILLING_TOWN_CITY', billingTownCity: string }
  | { type: 'SET_BILLING_COUNTY', billingCounty: string }
  | { type: 'SET_COUNTRY', country: string }
  | { type: 'SET_BILLING_POSTCODE', billingPostcode: string }
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
    billingAddressLine1: state.page.checkout.billingAddressLine1,
    billingAddressLine2: state.page.checkout.billingAddressLine2,
    billingTownCity: state.page.checkout.billingTownCity,
    billingPostcode: state.page.checkout.billingPostcode,
    country: state.common.internationalisation.countryId,
    startDate: state.page.checkout.startDate,
    telephone: state.page.checkout.telephone,
    paymentMethod: state.page.checkout.paymentMethod,
    fulfilmentOption: state.page.checkout.fulfilmentOption,
    productOption: state.page.checkout.productOption,
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
      error: formError('firstName', 'Please enter a first name.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a last name.'),
    },
    {
      rule: nonEmptyString(fields.billingAddressLine1),
      error: formError('billingAddressLine1', 'Please enter an address'),
    },
    {
      rule: nonEmptyString(fields.startDate),
      error: formError('startDate', 'Please select a start date'),
    },
    {
      rule: nonEmptyString(fields.billingTownCity),
      error: formError('billingTownCity', 'Please enter a city'),
    },
    {
      rule: nonEmptyString(fields.billingPostcode),
      error: formError('billingPostcode', 'Please enter a post code'),
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
  setBillingAddressLine1: (billingAddressLine1: string): Action => ({ type: 'SET_BILLING_ADDRESS_LINE_1', billingAddressLine1 }),
  setBillingAddressLine2: (billingAddressLine2: string): Action => ({ type: 'SET_BILLING_ADDRESS_LINE_2', billingAddressLine2 }),
  setBillingTownCity: (billingTownCity: string): Action => ({ type: 'SET_BILLING_TOWN_CITY', billingTownCity }),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
  setBillingCounty: (billingCounty: string): Action => ({ type: 'SET_BILLING_COUNTY', billingCounty }),
  setBillingPostcode: (billingPostcode: string): Action => ({ type: 'SET_BILLING_POSTCODE', billingPostcode }),
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

const getInitialProduct = (productInUrl: ?string, fulfillmentInUrl: ?string): Product => ({
  productOption:
    productInUrl === 'Saturday' ||
    productInUrl === 'SaturdayPlus' ||
    productInUrl === 'Sunday' ||
    productInUrl === 'SundayPlus' ||
    productInUrl === 'Weekend' ||
    productInUrl === 'WeekendPlus' ||
    productInUrl === 'Sixday' ||
    productInUrl === 'SixdayPlus' ||
    productInUrl === 'Everyday' ||
    productInUrl === 'EverydayPlus'
      ? (productInUrl: PaperProductOptions)
      : Everyday,
  fulfilmentOption:
    fulfillmentInUrl === 'Collection' || fulfillmentInUrl === 'HomeDelivery'
      ? (fulfillmentInUrl: PaperFulfilmentOptions)
      : Collection,
});

function initReducer(initialCountry: IsoCountry, productInUrl: ?string, fulfillmentInUrl: ?string) {
  const user = getUser(); // TODO: this is unnecessary, it should use the user reducer
  const { productPrices } = window.guardian;

  const initialState = {
    stage: 'checkout',
    title: null,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    billingAddressLine1: '',
    billingAddressLine2: null,
    billingTownCity: '',
    billingPostcode: '',
    startDate: '',
    telephone: null,
    paymentMethod: countrySupportsDirectDebit(initialCountry) ? 'DirectDebit' : 'Stripe',
    formErrors: [],
    submissionError: null,
    formSubmitted: false,
    isTestUser: isTestUser(),
    ...getInitialProduct(productInUrl, fulfillmentInUrl),
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

      case 'SET_BILLING_ADDRESS_LINE_1':
        return { ...state, billingAddressLine1: action.billingAddressLine1 };

      case 'SET_BILLING_ADDRESS_LINE_2':
        return { ...state, billingAddressLine2: action.billingAddressLine2 };

      case 'SET_BILLING_TOWN_CITY':
        return { ...state, billingTownCity: action.billingTownCity };

      case 'SET_BILLING_POSTCODE':
        return { ...state, billingPostcode: action.billingPostcode };

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
    billingPostcodeFinder: postcodeFinders.billing.reducer,
    deliveryPostcodeFinder: postcodeFinders.delivery.reducer,
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
  postcodeFinders,
};
