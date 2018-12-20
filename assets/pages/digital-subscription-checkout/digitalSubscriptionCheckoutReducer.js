// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';

import { type ReduxState } from 'helpers/page/page';
import { type Option } from 'helpers/types/option';
import { type DigitalBillingPeriod } from 'helpers/subscriptions';
import csrf, { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import {
  fromString,
  type IsoCountry,
  type StateProvince,
  stateProvinceFromString,
} from 'helpers/internationalisation/country';
import { formError, type FormError, nonEmptyString, notNull, validate, } from 'helpers/subscriptionsForms/validation';

import {
  marketingConsentReducerFor,
  type State as MarketingConsentState,
} from 'components/marketingConsent/marketingConsentReducer';
import { showPaymentMethod } from 'pages/digital-subscription-checkout/helpers/paymentProviders';
import { type User } from './helpers/user';


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
  email: string,
  errors: FormError<FormField>[],
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
  submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) => {
    const state = getState();
    const errors = getErrors(getFormFields(state));
    if (errors.length > 0) {
      dispatch(setFormErrors(errors));
    } else {
      showPaymentMethod(state);
    }
  },
};

export type FormActionCreators = typeof formActionCreators;


// ----- Reducer ----- //

function initReducer(user: User) {
  const initialState = {
    stage: 'checkout',
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    country: user.country || null,
    stateProvince: null,
    telephone: '',
    paymentFrequency: 'month',
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

  return combineReducers({
    checkout: reducer,
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


// ----- Export ----- //

export {
  initReducer,
  setStage,
  getFormFields,
  getEmail,
  formActionCreators,
};
