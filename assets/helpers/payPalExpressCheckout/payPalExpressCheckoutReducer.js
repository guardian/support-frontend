// @flow

// ----- Imports ----- //

import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Action } from './payPalExpressCheckoutActions';


// ----- Types ----- //

export type State = {
  amount: ?number,
  billingPeriod: string,
  currency: ?IsoCurrency,
  loaded: boolean,
};


// ----- Setup ----- //

const initialState: State = {
  amount: null,
  billingPeriod: 'monthly',
  currency: null,
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
      return Object.assign({}, state, { amount: action.amount, currency: action.currency.iso });

    default:
      return state;

  }

}
