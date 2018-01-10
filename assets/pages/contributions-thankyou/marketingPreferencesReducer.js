// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';


import { userReducer as user } from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { CommonState } from 'helpers/page/page';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Action } from './regularContributionsActions';
import type { PaymentStatus, PayPalButtonType } from './components/regularContributionsPayment';


// ----- Reducers ----- //

function createRegularContribReducer(amount: number, currency: Currency) {

  const initialUser: State = {
    amount,
    currency,
    error: null,
    paymentStatus: 'NotStarted',
    payPalType: 'NotSet',
    payPalHasLoaded: false,
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

      case 'SET_PAYPAL_HAS_LOADED':
        return Object.assign({}, state, { payPalHasLoaded: true });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createMarketingPreferencesReducer(amount: number, currency: Currency) {
  return user;
}
