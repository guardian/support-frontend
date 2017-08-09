// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { User as UserState } from 'helpers/user/userReducer';
import type { State as StripeCheckoutState } from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { State as PayPalExpressCheckoutState } from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { intCmpReducer as intCmp } from 'helpers/intCmp';
import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import payPalExpressCheckout from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';

import type { Action } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  currency: ?Currency,
  country: ?IsoCountry,
  error: ?string,
  payPalButtonExists: boolean,
};

export type CombinedState = {
  monthlyContrib: State,
  intCmp: string,
  user: UserState,
  stripeCheckout: StripeCheckoutState,
  payPalExpressCheckout: PayPalExpressCheckoutState,
  csrf: CsrfState,
};

// ----- Setup ----- //

const initialState: State = {
  amount: 5,
  currency: GBP,
  country: 'GB',
  error: null,
  payPalButtonExists: false,
};


// ----- Reducers ----- //

function monthlyContrib(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'SET_COUNTRY':
      return Object.assign({}, state, { country: action.value });

    case 'SET_CONTRIB_VALUE':
      return Object.assign({}, state, { amount: action.value, currency: action.currency });

    case 'CHECKOUT_ERROR':
      return Object.assign({}, state, { error: action.message });

    case 'SET_PAYPAL_BUTTON' :
      return Object.assign({}, state, { payPalButtonExists: action.value });

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
