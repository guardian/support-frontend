// @flow

// ----- Imports ----- //

import { compose, combineReducers, type Dispatch } from 'redux';

import { type ReduxState } from 'helpers/page/page';
import { type Option } from 'helpers/types/option';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type DigitalBillingPeriod } from 'helpers/subscriptions';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import csrf from 'helpers/csrf/csrfReducer';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import {
  type IsoCountry,
  fromString,
  type StateProvince,
  stateProvinceFromString,
} from 'helpers/internationalisation/country';
import {
  validate,
  nonEmptyString,
  notNull,
  formError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';

import {
  marketingConsentReducerFor,
  type State as MarketingConsentState,
} from 'components/marketingConsent/marketingConsentReducer';


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';
type PaymentMethod = 'card' | 'directDebit';

export type FormFields = {|
  firstName: string,
  lastName: string,
  country: Option<IsoCountry>,
  stateProvince: Option<StateProvince>,
  telephone: string,
  paymentFrequency: DigitalBillingPeriod,
  paymentMethod: PaymentMethod,
|};

export type FormField = $Keys<FormFields>;

type CheckoutState = {|
  stage: Stage,
  ...FormFields,
  errors: FormError<FormField>[],
|};

export type State = ReduxState<{|
  checkout: CheckoutState,
  user: UserState,
  csrf: CsrfState,
  marketingConsent: MarketingConsentState,
|}>;

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_COUNTRY', country: string }
  | { type: 'SET_STATE_PROVINCE', stateProvince: string }
  | { type: 'SET_PAYMENT_FREQUENCY', paymentFrequency: DigitalBillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SET_ERRORS', errors: FormError<FormField>[] };


// ----- Selectors ----- //

function getFormFields(state: State): FormFields {
  return {
    firstName: state.page.checkout.firstName,
    lastName: state.page.checkout.lastName,
    country: state.page.checkout.country,
    stateProvince: state.page.checkout.stateProvince,
    telephone: state.page.checkout.telephone,
    paymentFrequency: state.page.checkout.paymentFrequency,
    paymentMethod: state.page.checkout.paymentMethod,
  };
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
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({ type: 'SET_ERRORS', errors });

const formActionCreators = {
  setFirstName: (firstName: string): Action => ({ type: 'SET_FIRST_NAME', firstName }),
  setLastName: (lastName: string): Action => ({ type: 'SET_LAST_NAME', lastName }),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
  setStateProvince: (stateProvince: string): Action => ({ type: 'SET_STATE_PROVINCE', stateProvince }),
  setPaymentFrequency: (paymentFrequency: DigitalBillingPeriod): Action => ({ type: 'SET_PAYMENT_FREQUENCY', paymentFrequency }),
  setPaymentMethod: (paymentMethod: PaymentMethod): Action => ({ type: 'SET_PAYMENT_METHOD', paymentMethod }),
  submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) =>
    compose(dispatch, setFormErrors, getErrors, getFormFields)(getState()),
};

export type FormActionCreators = typeof formActionCreators;


// ----- Reducer ----- //

const initialState = {
  stage: 'checkout',
  firstName: '',
  lastName: '',
  country: null,
  stateProvince: null,
  telephone: '',
  paymentFrequency: 'monthly',
  paymentMethod: 'directDebit',
  errors: [],
};

function reducer(state: CheckoutState = initialState, action: Action): CheckoutState {

  switch (action.type) {

    case 'SET_STAGE':
      return { ...state, stage: action.stage };

    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.firstName };

    case 'SET_LAST_NAME':
      return { ...state, lastName: action.lastName };

    case 'SET_TELEPHONE':
      return { ...state, telephone: action.telephone };

    case 'SET_COUNTRY':
      return { ...state, country: fromString(action.country), stateProvince: null };

    case 'SET_STATE_PROVINCE':
      return { ...state, stateProvince: stateProvinceFromString(state.country, action.stateProvince) };

    case 'SET_PAYMENT_FREQUENCY':
      return { ...state, paymentFrequency: action.paymentFrequency };

    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.paymentMethod };

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    default:
      return state;

  }

}

function initReducer(countryGroupId: CountryGroupId = detect()) {
  return combineReducers({
    checkout: reducer,
    user: createUserReducer(countryGroupId),
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


// ----- Export ----- //

export {
  initReducer,
  setStage,
  getFormFields,
  formActionCreators,
};
