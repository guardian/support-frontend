// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import { intCmpReducer as intCmp } from 'helpers/intCmp';
import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import payPalExpressCheckout from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';

import type { PayPalButtonType } from 'components/paymentMethods/paymentMethods';
import type { Action } from '../actions/oneoffContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  country: string,
  error: ?string,
  payPalType: PayPalButtonType,
};


// ----- Setup ----- //

const initialState: State = {
  amount: 50,
  country: 'GB',
  error: null,
  payPalType: 'NotSet',
};


// ----- Reducers ----- //

function oneoffContrib(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'SET_CONTRIB_VALUE':
      return Object.assign({}, state, { amount: action.value });

    case 'CHECKOUT_ERROR':
      return Object.assign({}, state, { error: action.message });

    case 'SET_PAYPAL_BUTTON' :
      return Object.assign({}, state, { payPalType: action.value });

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  oneoffContrib,
  intCmp,
  user,
  stripeCheckout,
  payPalExpressCheckout,
  csrf,
});
