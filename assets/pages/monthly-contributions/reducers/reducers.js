// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import stripeCheckout from 'helpers/stripeCheckout/stripeCheckoutReducer';


// ----- Exports ----- //

export default combineReducers({
  stripeCheckout,
});
