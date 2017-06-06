// @flow

// ----- Imports ----- //

import type { Action } from './stripeCheckoutActions';


// ----- Types ----- //

type State = {
  loaded: boolean,
  overlay: boolean,
  amount: ?number,
  token: ?string,
};


// ----- Setup ----- //

const initialState: State = {
  loaded: false,
  overlay: false,
  amount: null,
  token: null,
};


// ----- Exports ----- //

export default function stripeCheckoutReducer(
  state: State = initialState,
  action: Action): State {

  switch (action.type) {

    case 'STRIPE_CHECKOUT_LOADED':
      return Object.assign({}, state, { loaded: true });

    case 'OPEN_STRIPE_OVERLAY':
      return Object.assign({}, state, { overlay: true, amount: action.amount });

    default:
      return state;

  }

}
