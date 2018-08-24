// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { userReducer as user } from 'helpers/user/userReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import csrf from 'helpers/csrf/csrfReducer';

import type { CommonState } from 'helpers/page/page';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import type { Action } from './oneoffContributionsActions';
import { checkoutFormReducer as checkoutForm, type OneOffContributionsCheckoutFormState } from './components/contributionsCheckoutContainer/checkoutFormReducer';


// ----- Types ----- //

export type State = {
  amount: number,
  error: ?string,
  paymentComplete: boolean,
};

export type CombinedState = {
  oneoffContrib: State,
  user: UserState,
  csrf: CsrfState,
  checkoutForm: OneOffContributionsCheckoutFormState,
  marketingConsent: MarketingConsentState,
};

export type PageState = {
  common: CommonState,
  page: CombinedState,
}


// ----- Reducers ----- //

function createOneOffContribReducer(amount: number) {

  const initialState: State = {
    amount,
    error: null,
    paymentComplete: false,
  };

  return function oneOffContribReducer(state: State = initialState, action: Action): State {

    switch (action.type) {

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { error: action.message });

      case 'CHECKOUT_SUCCESS':
        return Object.assign({}, state, { paymentComplete: true });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootOneOffContribReducer(amount: number) {
  return combineReducers({
    oneoffContrib: createOneOffContribReducer(amount),
    marketingConsent: marketingConsentReducerFor('CONTRIBUTIONS_THANK_YOU'),
    user,
    csrf,
    checkoutForm,
  });
}
