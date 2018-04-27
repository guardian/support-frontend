// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { userReducer as user } from 'helpers/user/userReducer';
import { marketingConsentReducerFor } from 'containerisableComponents/marketingConsent/marketingConsentReducer';
import csrf from 'helpers/csrf/csrfReducer';

import type { CommonState } from 'helpers/page/page';

import type { PayPalButtonType } from './components/oneoffContributionsPayment';
import type { Action } from './oneoffContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  error: ?string,
  payPalType: PayPalButtonType,
};

export type CombinedState = {
  oneoffContrib: State,
  user: UserState,
  csrf: CsrfState,
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
    payPalType: 'NotSet',
  };

  return function oneOffContribReducer(state: State = initialState, action: Action): State {

    switch (action.type) {

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { error: action.message });

      case 'SET_PAYPAL_BUTTON':
        return Object.assign({}, state, { payPalType: action.value });

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
  });
}
