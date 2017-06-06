// @flow

// ----- Imports ----- //

import * as stripeCheckout from './stripeCheckout';


// ----- Types ----- //

export type Action =
  | { type: 'START_STRIPE_CHECKOUT' }
  | { type: 'STRIPE_CHECKOUT_LOADED' }
  | { type: 'SET_STRIPE_CHECKOUT_TOKEN', token: string }
  | { type: 'CLOSE_STRIPE_OVERLAY' }
  | { type: 'OPEN_STRIPE_OVERLAY', amount: number }
  ;


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

export function openStripeOverlay(amount: number): Action {
  stripeCheckout.openDialogBox();
  return { type: 'OPEN_STRIPE_OVERLAY', amount };
}

export function setupStripeCheckout(): Function {

  return (dispatch) => {

    const handleToken = (token) => {
      dispatch(setStripeCheckoutToken(token));
    };

    const handleCloseOverlay = () => dispatch(closeStripeOverlay());

    dispatch(startStripeCheckout());

    return stripeCheckout.setup(handleToken, handleCloseOverlay).then(() => {
      dispatch(stripeCheckoutLoaded());
    });

  };

}
