// @flow

// ----- Imports ----- //

import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Action } from './stripeCheckoutActions';
import type { State as StripeCheckoutState } from './stripeCheckoutReducer';

// ----- Types ----- //

export type State = {
  loaded: boolean,
  amount: number,
  token: ?string,
  currency: IsoCurrency,
};

export type CombinedState = {
  stripeCheckout: StripeCheckoutState,
};

// ----- Exports ----- //

export default function createStripeCheckoutReducer(amount: number, currency: IsoCurrency) {

  const initialState: State = {
    loaded: false,
    amount,
    token: null,
    currency,
  };

  return function stripeCheckoutReducer(state: State = initialState, action: Action): State {

    switch (action.type) {

      case 'STRIPE_CHECKOUT_LOADED':
        return Object.assign({}, state, { loaded: true });

      default:
        return state;

    }
  };
}
