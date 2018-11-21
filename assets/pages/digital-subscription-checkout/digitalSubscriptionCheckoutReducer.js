// @flow

// ----- Imports ----- //

import { compose, type Dispatch } from 'redux';

import type { CommonState } from 'helpers/page/commonReducer';
import { type IsoCountry, fromString } from 'helpers/internationalisation/country';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import csrf from 'helpers/csrf/csrfReducer';

import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import { combineReducers } from 'redux';

import {
  validate,
  nonEmptyString,
  notNull,
  formError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';

export type FormFields = {|
  firstName: string,
  lastName: string,
  country: IsoCountry | null,
  telephone: string,
|};

export type FormField = $Keys<FormFields>;

type CheckoutState = {|
  stage: Stage,
  ...FormFields,
  errors: FormError<FormField>[],
|};

type PageState = {|
  checkout: CheckoutState,
  user: UserState,
  csrf: CsrfState,
  marketingConsent: MarketingConsentState,
|};

export type State = {
  common: CommonState,
  page: PageState,
};

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_COUNTRY', country: string }
  | { type: 'SET_ERRORS', errors: FormError<FormField>[] };


// ----- Selectors ----- //

function getFormFields(state: State): FormFields {
  return {
    firstName: state.page.checkout.firstName,
    lastName: state.page.checkout.lastName,
    country: state.page.checkout.country,
    telephone: state.page.checkout.telephone,
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
  telephone: '',
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
      return { ...state, country: fromString(action.country) };

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
