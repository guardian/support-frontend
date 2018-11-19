// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/commonReducer';
import { type IsoCountry, fromString } from 'helpers/internationalisation/country';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import csrf from 'helpers/csrf/csrfReducer';

import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import { combineReducers } from 'redux';


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';

export type FormFields = {|
  firstName: string,
  lastName: string,
  country: IsoCountry | null,
  telephone: string,
|};

type CheckoutState = {|
  stage: string,
  firstName: string,
  lastName: string,
  country: ?string,
  telephone: string,
|}

type PageState = {|
  form: {
    stage: Stage,
    ...FormFields,
  },
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
  | { type: 'SET_COUNTRY', country: string };


// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });

const formActionCreators = {
  setFirstName: (firstName: string): Action => ({ type: 'SET_FIRST_NAME', firstName }),
  setLastName: (lastName: string): Action => ({ type: 'SET_LAST_NAME', lastName }),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
};

export type FormActionCreators = typeof formActionCreators;


// ----- Selectors ----- //

function formFieldsSelector(state: State): FormFields {
  return {
    firstName: state.page.form.firstName,
    lastName: state.page.form.lastName,
    country: state.page.form.country,
    telephone: state.page.form.telephone,
  };
}


// ----- Reducer ----- //

const initialState = {
  stage: 'thankyou',
  firstName: '',
  lastName: '',
  country: null,
  telephone: '',
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

    default:
      return state;

  }

}

function initReducer(countryGroupId: CountryGroupId = detect()) {
  return combineReducers({
    form: reducer,
    user: createUserReducer(countryGroupId),
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


// ----- Export ----- //

export {
  initReducer,
  setStage,
  formFieldsSelector,
  formActionCreators,
};
