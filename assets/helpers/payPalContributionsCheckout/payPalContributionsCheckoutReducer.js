// @flow

// ----- Imports ----- //

import type { Action } from './payPalContributionsCheckoutActions';


// ----- Types ----- //

export type State = {
  amount: ?number,
  currency: string,
  payPalPayClicked: boolean,
};


// ----- Setup ----- //

const initialState: State = {
  payPalPayClicked: false,
  currency: 'GBP',
  amount: null,
};


// ----- Exports ----- //

export default function payPalContributionsCheckoutReducer(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED':
      return Object.assign({}, state, { payPalPayClicked: true });

    case 'SET_PAYPAL_CONTRIBUTIONS_AMOUNT':
      return Object.assign({}, state, { amount: action.amount });

    default:
      return state;

  }
}
