// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { createUserReducer } from 'helpers/user/userReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import csrf from 'helpers/csrf/csrfReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/page';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import type { Action } from './oneoffContributionsActions';
import { checkoutFormReducer as checkoutForm, type OneOffContributionsCheckoutFormState } from './helpers/checkoutForm/checkoutFormReducer';


// ----- Types ----- //

export type OneOffContributionsState = {
  amount: number,
  error: ?string,
  paymentComplete: boolean,
};

export type PageState = {
  oneoffContrib: OneOffContributionsState,
  user: UserState,
  csrf: CsrfState,
  checkoutForm: OneOffContributionsCheckoutFormState,
  marketingConsent: MarketingConsentState,
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducers ----- //

function createOneOffContributionsReducer(amount: number) {

  const initialState: OneOffContributionsState = {
    amount,
    error: null,
    paymentComplete: false,
  };

  return function oneOffContribReducer(
    state: OneOffContributionsState = initialState,
    action: Action,
  ): OneOffContributionsState {

    switch (action.type) {

      case 'CHECKOUT_ERROR':
        return { ...state, error: action.message };

      case 'CHECKOUT_SUCCESS':
        return { ...state, paymentComplete: true };

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootOneOffContributionsReducer(amount: number, countryGroup: CountryGroupId) {
  return combineReducers({
    oneoffContrib: createOneOffContributionsReducer(amount),
    marketingConsent: marketingConsentReducerFor('CONTRIBUTIONS_THANK_YOU'),
    user: createUserReducer(countryGroup),
    csrf,
    checkoutForm,
  });
}
