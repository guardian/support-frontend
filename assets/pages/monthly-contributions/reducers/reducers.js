// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { Action } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  country: string,
  firstName: ?string,
  lastName: ?string,
};


// ----- Setup ----- //

const initialState: State = {
  amount: 5,
  country: 'GB',
  firstName: null,
  lastName: null,
};


// ----- Reducers ----- //

function monthlyContrib(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'SET_CONTRIB_VALUE':
      return Object.assign({}, state, { amount: action.value });

    case 'SET_FIRST_NAME':
      return Object.assign({}, state, { firstName: action.name });

    case 'SET_LAST_NAME':
      return Object.assign({}, state, { lastName: action.name });

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  monthlyContrib,
  stripeCheckout,
});
