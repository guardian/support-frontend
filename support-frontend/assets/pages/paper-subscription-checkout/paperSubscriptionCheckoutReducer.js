// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';

import { type ReduxState } from 'helpers/page/page';
import { type Option } from 'helpers/types/option';
import csrf, { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { formError, type FormError, nonEmptyString, validate, notNull } from 'helpers/subscriptionsForms/validation';
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
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { Collection, type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
  Everyday,
  type PaperProductOptions, ActivePaperProductTypes,
} from 'helpers/productPrice/productOptions';
import { type Title } from 'helpers/user/details';
import { getUser } from './helpers/user';
import { showPaymentMethod, onPaymentAuthorised, countrySupportsDirectDebit } from './helpers/paymentProviders';
import {
  addressReducerFor,
  getFormFields as getAddressFormFields,
  getFormErrors as getAddressFormErrors,
  setFormErrorsFor as setAddressFormErrorsFor,
  type Action as AddressAction,
  type State as AddressState,
  type FormField as AddressFormField,
} from './components-checkout/addressFieldsStore';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, Stripe } from 'helpers/paymentMethods';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';

<<<<<<< HEAD
import { getVoucherDays, getDeliveryDays, formatMachineDate } from './helpers/deliveryDays';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';


=======
>>>>>>> Move personal details form fields to a separate component
// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';

type Product = {|
  fulfilmentOption: PaperFulfilmentOptions,
  productOption: PaperProductOptions,
|};

export type FormFields = {|
  ...Product,
  title: Option<Title>,
  firstName: string,
  lastName: string,
  email: string,
  startDate: Option<string>,
  telephone: Option<string>,
  paymentMethod: Option<PaymentMethod>,
  billingAddressIsSame: boolean,
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
  | { type: 'SET_BILLING_ADDRESS_IS_SAME', isSame: boolean }
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
    fulfilmentOption: state.page.checkout.fulfilmentOption,
    productOption: state.page.checkout.productOption,
    billingAddressIsSame: state.page.checkout.billingAddressIsSame,
  };
}

function getEmail(state: State): string {
  return state.page.checkout.email;
}

const getDeliveryAddress = (state: State): AddressState => state.page.deliveryAddress;
const getBillingAddress = (state: State): AddressState => state.page.billingAddress;

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
  ]);
}

function getDays(fulfilmentOption: PaperFulfilmentOptions, productOption: PaperProductOptions) {
  return (fulfilmentOption === HomeDelivery ? getDeliveryDays(Date.now(), productOption)
    : getVoucherDays(Date.now(), productOption));
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
    showPaymentMethod(dispatch, state);
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
    onPaymentAuthorised(authorisation, dispatch, getState()),
  submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) => submitForm(dispatch, getState()),
  setbillingAddressIsSame: (isSame: boolean): Action => ({ type: 'SET_BILLING_ADDRESS_IS_SAME', isSame }),
};

export type FormActionCreators = typeof formActionCreators;

// ----- Reducer ----- //

const getInitialProduct = (productInUrl: ?string, fulfillmentInUrl: ?string): Product => ({
  productOption:
    ActivePaperProductTypes.includes(productInUrl)
      // $FlowIgnore - flow doesn't recognise that we've checked the value of productInUrl
      ? (productInUrl: PaperProductOptions)
      : Everyday,
  fulfilmentOption:
  paperHasDeliveryEnabled() && (fulfillmentInUrl === 'Collection' || fulfillmentInUrl === 'HomeDelivery')
    ? (fulfillmentInUrl: PaperFulfilmentOptions)
    : Collection,
});

function initReducer(initialCountry: IsoCountry, productInUrl: ?string, fulfillmentInUrl: ?string) {
  const user = getUser(); // TODO: this is unnecessary, it should use the user reducer
  const { productPrices } = window.guardian;

  const product = getInitialProduct(productInUrl, fulfillmentInUrl);
  const days: Date[] = getDays(product.fulfilmentOption, product.productOption);

  const initialState = {
    stage: 'checkout',
    title: null,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    startDate: formatMachineDate(days[0]) || null,
    telephone: null,
    paymentMethod: countrySupportsDirectDebit(initialCountry) ? DirectDebit : Stripe,
    formErrors: [],
    submissionError: null,
    formSubmitted: false,
    isTestUser: isTestUser(),
    ...product,
    productPrices,
    billingAddressIsSame: true,
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
  getFormFields,
  getEmail,
  getDeliveryAddress,
  getBillingAddress,
  setSubmissionError,
  setFormSubmitted,
  signOut,
  formActionCreators,
  getDays,
};
