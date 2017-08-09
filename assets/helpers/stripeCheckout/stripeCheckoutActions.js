// @flow

// ----- Imports ----- //

import * as stripeCheckout from './stripeCheckout';
import type { State as StripeCheckoutState } from './stripeCheckoutReducer';

// ----- Types ----- //

export type Action =
  | { type: 'START_STRIPE_CHECKOUT' }
  | { type: 'STRIPE_CHECKOUT_LOADED' }
  | { type: 'SET_STRIPE_CHECKOUT_TOKEN', token: string }
  | { type: 'CLOSE_STRIPE_OVERLAY' }
  | { type: 'OPEN_STRIPE_OVERLAY' }
  ;

type CombinedState = {
  stripeCheckout: StripeCheckoutState,
};

// ----- Actions ----- //

function startStripeCheckout(): Action {
  return { type: 'START_STRIPE_CHECKOUT' };
}

function stripeCheckoutLoaded(): Action {
  return { type: 'STRIPE_CHECKOUT_LOADED' };
}

function setStripeCheckoutToken(token: string): Action {
  return { type: 'SET_STRIPE_CHECKOUT_TOKEN', token };
}

function closeStripeOverlay(): Action {
  return { type: 'CLOSE_STRIPE_OVERLAY' };
}

export function openStripeOverlay(amount: number, email: string): Action {
  stripeCheckout.openDialogBox(amount, email);
  return { type: 'OPEN_STRIPE_OVERLAY' };
}

export function setupStripeCheckout(callback: Function): Function {

  return (dispatch, getState: () => CombinedState) => {

    const handleToken = (token) => {
      dispatch(setStripeCheckoutToken(token.id));
      callback(token.id, dispatch, getState);
    };

    const handleCloseOverlay = () => dispatch(closeStripeOverlay());

    dispatch(startStripeCheckout());

    return stripeCheckout.setup(
      getState().stripeCheckout,
      handleToken,
      handleCloseOverlay,
    ).then(() => dispatch(stripeCheckoutLoaded()));

  };

}
