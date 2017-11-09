// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { userReducer as user } from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { CommonState } from 'helpers/page/page';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Action } from './regularContributionsActions';
import type { PaymentStatus, PayPalButtonType } from './components/regularContributionsPayment';


// ----- Types ----- //

export type State = {
  amount: number,
  currency: Currency,
  error: ?string,
  paymentStatus: PaymentStatus,
  payPalType: PayPalButtonType,
  statusUri: ?string,
  pollCount: number,
};

export type CombinedState = {
  regularContrib: State,
  user: UserState,
  csrf: CsrfState,
};

export type PageState = {
  common: CommonState,
  page: CombinedState,
}

// ----- Reducers ----- //

function createRegularContribReducer(amount: number, currency: Currency) {

  const initialState: State = {
    amount,
    currency,
    error: null,
    paymentStatus: 'NotStarted',
    payPalType: 'NotSet',
    statusUri: null,
    pollCount: 0,
  };

  return function regularContrib(state: State = initialState, action: Action): State {
    switch (action.type) {

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { paymentStatus: 'Failed', error: action.message });

      case 'CREATING_CONTRIBUTOR':
        return Object.assign({}, state, { paymentStatus: 'Pending' });

      case 'SET_PAYPAL_BUTTON':
        return Object.assign({}, state, { payPalType: action.value });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootRegularContributionsReducer(amount: number, currency: Currency) {
  return combineReducers({
    regularContrib: createRegularContribReducer(amount, currency),
    user,
    csrf,
  });
}
