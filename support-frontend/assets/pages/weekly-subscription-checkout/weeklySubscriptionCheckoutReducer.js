// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';

import { type ReduxState } from 'helpers/page/page';
import { type Option } from 'helpers/types/option';
import csrf, { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry, GBPCountries } from 'helpers/internationalisation/countryGroup';
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
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { type Title } from 'helpers/user/details';
import { getUser } from 'helpers/user/user';
import { buildRegularPaymentRequest, onPaymentAuthorised, showPaymentMethod } from './helpers/paymentProviders';
import { countrySupportsDirectDebit } from 'helpers/paymentProviders';
import {
  type Action as AddressAction,
  addressReducerFor,
  type FormField as AddressFormField,
  getFormErrors as getAddressFormErrors,
  getFormFields as getAddressFormFields,
  setFormErrorsFor as setAddressFormErrorsFor,
  type State as AddressState,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { Stripe } from 'helpers/paymentMethods';
import { getWeeklyDays } from './helpers/deliveryDays';
import { formatUserDate } from 'helpers/dateConversions';

// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';

export type FormFields = {|
  title: Option<Title>,
  firstName: string,
  lastName: string,
  email: string,
  startDate: Option<string>,
  telephone: Option<string>,
  paymentMethod: Option<PaymentMethod>,
  billingAddressIsSame: boolean | null,
|};

export type FormField = $Keys<FormFields>;

type CheckoutState = {|
  stage: Stage,
  ...FormFields,
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
  deliveryAddress: AddressState,
  billingAddress: AddressState,
|}>;

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_TITLE', title: Option<Title> }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_START_DATE', startDate: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SET_COUNTRY_CHANGED', country: IsoCountry }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | { type: 'SET_BILLING_ADDRESS_IS_SAME', isSame: boolean | null }
  | DDAction
  | AddressAction;

// ----- Selectors ----- //

function getFormFields(state: State): FormFields {
  return {
    title: state.page.checkout.title,
    firstName: state.page.checkout.firstName,
    email: state.page.checkout.email,
    lastName: state.page.checkout.lastName,
    startDate: state.page.checkout.startDate,
    telephone: state.page.checkout.telephone,
    paymentMethod: state.page.checkout.paymentMethod,
    billingAddressIsSame: state.page.checkout.billingAddressIsSame,
  };
}

function getEmail(state: State): string {
  return state.page.checkout.email;
}

const getDeliveryAddress = (state: State): AddressState => state.page.deliveryAddress;
const getBillingAddress = (state: State): AddressState => state.page.billingAddress;

const today = new Date().getTime();
const days = getWeeklyDays(today);

function getDays() {
  return days.map(day => formatUserDate(day));
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
      rule: notNull(fields.startDate),
      error: formError('startDate', 'Please select a start date'),
    },
    {
      rule: notNull(fields.billingAddressIsSame),
      error: formError(
        'billingAddressIsSame',
        'Please indicate whether the billing address is the same as the delivery address',
      ),
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

  type Error<T> = {
    errors: FormError<T>[],
    dispatcher: any => Action,
  }

  const formFields: FormFields = getFormFields(state);

  const allErrors: (Error<AddressFormField> | Error<FormField>)[] = [
    ({
      errors: getErrors(formFields),
      dispatcher: setFormErrors,
    }: Error<FormField>),
    ({
      errors: getAddressFormErrors(getAddressFormFields(getDeliveryAddress(state))),
      dispatcher: setAddressFormErrorsFor('delivery'),
    }: Error<AddressFormField>),
  ].filter(({ errors }) => errors.length > 0);

  if (!formFields.billingAddressIsSame) {
    allErrors.push(({
      errors: getAddressFormErrors(getAddressFormFields(getBillingAddress(state))),
      dispatcher: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>));
  }

  if (allErrors.length > 0) {
    allErrors.forEach(({ errors, dispatcher }) => {
      dispatch(dispatcher(errors));
    });
  } else {
    const testUser = state.page.checkout.isTestUser;

    const { price, currency } = { price: 99.99, currency: 'GBP' };

    const onAuthorised = (pa: PaymentAuthorisation) =>
      onPaymentAuthorised(
        dispatch,
        buildRegularPaymentRequest(state, pa),
        state.page.csrf,
        state.common.abParticipations,
      );

    const { paymentMethod, email } = state.page.checkout;

    showPaymentMethod(dispatch, onAuthorised, testUser, price, currency, paymentMethod, email);
  }
}

const formActionCreators = {
  setTitle: (title: string): Action => ({ type: 'SET_TITLE', title }),
  setFirstName: (firstName: string): Action => ({ type: 'SET_FIRST_NAME', firstName }),
  setLastName: (lastName: string): Action => ({ type: 'SET_LAST_NAME', lastName }),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setStartDate: (startDate: string): Action => ({ type: 'SET_START_DATE', startDate }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>) =>
    dispatch({
      type: 'SET_PAYMENT_METHOD',
      paymentMethod,
    }),
  onPaymentAuthorised: (authorisation: PaymentAuthorisation) => (dispatch: Dispatch<Action>, getState: () => State) =>
    onPaymentAuthorised(
      dispatch,
      buildRegularPaymentRequest(getState(), authorisation),
      getState().page.csrf,
      getState().common.abParticipations,
    ),
  submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) => submitForm(dispatch, getState()),
  setbillingAddressIsSame: (isSame: boolean | null): Action => ({ type: 'SET_BILLING_ADDRESS_IS_SAME', isSame }),
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
    startDate: getDays()[0],
    telephone: null,
    paymentMethod: countrySupportsDirectDebit(initialCountry) ? null : Stripe,
    formErrors: [],
    submissionError: null,
    formSubmitted: false,
    isTestUser: isTestUser(),
    productPrices,
    billingAddressIsSame: null,
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

      case 'SET_BILLING_ADDRESS_IS_SAME':
        return { ...state, billingAddressIsSame: action.isSame };

      default:
        return state;
    }
  }

  return combineReducers({
    checkout: reducer,
    user: createUserReducer(fromCountry(initialCountry) || GBPCountries),
    directDebit,
    billingAddress: addressReducerFor('billing', initialCountry),
    deliveryAddress: addressReducerFor('delivery', initialCountry),
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}

// ----- Export ----- //

export {
  initReducer,
  setStage,
  setFormErrors,
  getDays,
  getFormFields,
  getEmail,
  getDeliveryAddress,
  getBillingAddress,
  setSubmissionError,
  setFormSubmitted,
  signOut,
  formActionCreators,
};
