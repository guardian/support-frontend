// @flow

// ----- Imports ----- //

import type { Action } from './payPalExpressCheckoutActions';


// ----- Types ----- //

export type State = {
  amount: ?number,
  billingPeriod: string,
  currency: string,
  loaded: boolean,
};


// ----- Setup ----- //

const initialState: State = {
  amount: null,
  billingPeriod: 'monthly',
  currency: 'GBP',
  loaded: false,
};


// ----- Exports ----- //

export default function payPalExpressCheckoutReducer(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'PAYPAL_EXPRESS_CHECKOUT_LOADED':
      return Object.assign({}, state, { loaded: true });

    case 'SET_PAYPAL_EXPRESS_AMOUNT':
      return Object.assign({}, state, { amount: action.amount });

    default:
      return state;

  }

}
