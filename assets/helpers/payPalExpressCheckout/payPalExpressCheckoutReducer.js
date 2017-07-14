// @flow

// ----- Imports ----- //

import type { Action } from './payPalExpressCheckoutActions';


// ----- Types ----- //

export type State = {
  loaded: boolean,
  amount: ?number,
  baId: ?string,
  currency: string,
  billingPeriod: string,
};


// ----- Setup ----- //

const initialState: State = {
  amount: null,
  baid: null,
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
