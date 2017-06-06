// @flow

// ----- Imports ----- //

import * as stripeCheckout from '';
import type { Contrib, Amount } from '../reducers/reducers';


// ----- Types ----- //

export type Action =
  | { type: 'CHANGE_CONTRIB_TYPE', contribType: Contrib }
  | { type: 'CHANGE_CONTRIB_AMOUNT', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_RECURRING', amount: Amount }
  | { type: 'CHANGE_CONTRIB_AMOUNT_ONEOFF', amount: Amount }
  ;


// ----- Actions ----- //

const startStripeCheckout = () => {
  return { type: 'START_STRIPE_CHECKOUT'};
}

const stripeCheckoutLoaded = () => {
  return { type: 'STRIPE_CHECKOUT_LOADED'};
}

export function openStripeOverlay(): Action {
  openDialogBox();
  return { type: 'OPEN_STRIPE_OVERLAY' };
}

export function setupStripeCheckout(): Action {

  return dispatch => {
    dispatch(startStripeCheckout())
    return stripeCheckout.setup().then(() => {
      dispatch(stripeCheckoutLoaded());
    })

  }

}
