// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import { intCmpReducer as intCmp } from 'helpers/intCmp';
import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import payPalExpressCheckout from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';

import type { Action } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  country: string,
  error: ?string,
  payPalButtonExists: boolean,
  trackingUri: ?string,
  pollCount: number,
};


// ----- Setup ----- //

const initialState: State = {
  amount: 5,
  country: 'GB',
  error: null,
  payPalButtonExists: false,
  trackingUri: null,
  pollCount: 0,
};


// ----- Reducers ----- //

function monthlyContrib(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'SET_CONTRIB_VALUE':
      return Object.assign({}, state, { amount: action.value });

    case 'CHECKOUT_ERROR':
      return Object.assign({}, state, { error: action.message });

    case 'SET_PAYPAL_BUTTON' :
      return Object.assign({}, state, { payPalButtonExists: action.value });

    case 'SET_TRACKING_URI' :
      return Object.assign({}, state, { trackingUri: action.uri });

    case 'INCREMENT_POLL_COUNT':
      return Object.assign({}, state, { pollCount: state.pollCount + 1 });

    case 'RESET_POLL_COUNT':
      return Object.assign({}, state, { pollCount: 0 });

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  monthlyContrib,
  intCmp,
  user,
  stripeCheckout,
  payPalExpressCheckout,
  csrf,
});
