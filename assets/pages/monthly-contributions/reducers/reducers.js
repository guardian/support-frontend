// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { Action } from '../actions/monthlyContributionsActions';


// ----- Reducers ----- //

function monthlyContrib(
  state: number = 5,
  action: Action): number {

  switch (action.type) {

    case 'SET_CONTRIB_VALUE':
      return action.value;

    default:
      return state;

  }

}


// ----- Exports ----- //

export default combineReducers({
  monthlyContrib,
  stripeCheckout,
});
