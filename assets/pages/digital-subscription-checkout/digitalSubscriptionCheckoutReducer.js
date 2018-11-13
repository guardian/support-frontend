// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { createUserReducer } from 'helpers/user/userReducer';
import { type User as UserState } from 'helpers/user/userReducer'; // <-- for when we need it (to shut the Linter up)
import { marketingConsentReducerFor, type State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { type IsoCountry, fromString } from 'helpers/internationalisation/country';


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';

export type FormFields = {|
  firstName: string,
  lastName: string,
  country: IsoCountry | null,
  telephone: string,
|};

type CheckoutState = {
  stage: Stage,
  ...FormFields,
}

type PageState = {|
  checkout: CheckoutState,
  user: UserState,
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
    firstName: state.page.checkout.firstName,
    lastName: state.page.checkout.lastName,
    country: state.page.checkout.country,
    telephone: state.page.checkout.telephone,
  };
}


// ----- Reducer ----- //

const initialState = {
  stage: 'checkout',
  firstName: '',
  lastName: '',
  country: null,
  telephone: '',
};

function checkoutReducer(state: CheckoutState = initialState, action: Action): CheckoutState {

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

function initReducer(cgId: CountryGroupId = detect()) {
  const userState = createUserReducer(cgId);
  const marketingState = marketingConsentReducerFor('DIGITAL_SUBSCRIPTION_CHECKOUT');
  return combineReducers({
    checkout: checkoutReducer,
    user: userState,
    marketingConsent: marketingState,
  });
}

// ----- Export ----- //

export {
  initReducer,
  setStage,
  formFieldsSelector,
  formActionCreators,
};
