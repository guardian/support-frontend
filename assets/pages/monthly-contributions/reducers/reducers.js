// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import payPalExpressCheckout from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import user from 'helpers/user/userReducer';

import type { Action } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  country: string,
  error: ?string,
  payPalButton: boolean,
};


// ----- Setup ----- //

const initialState: State = {
  amount: 5,
  country: 'GB',
  error: null,
  payPalButton: false,
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
      return Object.assign({}, state, { payPalButton: action.value });

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  monthlyContrib,
  user,
  stripeCheckout,
  payPalExpressCheckout,
});
