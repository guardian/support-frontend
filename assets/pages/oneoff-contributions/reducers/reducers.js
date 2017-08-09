// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';
import type { State as StripeCheckoutState } from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { intCmpReducer as intCmp } from 'helpers/intCmp';
import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';

import type { Action } from '../actions/oneoffContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  currency: ?Currency,
  country: ?IsoCountry,
  error: ?string,
};

export type CombinedState = {
  oneoffContrib: State,
  intCmp: string,
  user: UserState,
  stripeCheckout: StripeCheckoutState,
  csrf: CsrfState,
};

// ----- Setup ----- //

const initialState: State = {
  amount: 50,
  currency: null,
  country: null,
  error: null,
};


// ----- Reducers ----- //

function oneoffContrib(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'SET_COUNTRY':
      return Object.assign({}, state, { country: action.value });

    case 'SET_CONTRIB_VALUE':
      return Object.assign({}, state, { amount: action.value, currency: action.currency });

    case 'CHECKOUT_ERROR':
      return Object.assign({}, state, { error: action.message });

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
  csrf,
});
