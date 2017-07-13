// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';

import type { Action } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  country: string,
  error: ?string,
};


// ----- Setup ----- //

const initialState: State = {
  amount: 5,
  country: 'GB',
  error: null,
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

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  monthlyContrib,
  user,
  stripeCheckout,
  csrf,
});
