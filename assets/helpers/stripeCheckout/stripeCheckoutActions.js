// @flow

// ----- Imports ----- //

import * as stripeCheckout from './stripeCheckout';


// ----- Setup ----- //

const MONTHLY_CONTRIB_ENDPOINT = '/monthly-contributions/create';


// ----- Types ----- //

export type Action =
  | { type: 'START_STRIPE_CHECKOUT' }
  | { type: 'STRIPE_CHECKOUT_LOADED' }
  | { type: 'SET_STRIPE_CHECKOUT_TOKEN', token: string }
  | { type: 'CLOSE_STRIPE_OVERLAY' }
  | { type: 'OPEN_STRIPE_OVERLAY' }
  | { type: 'SET_STRIPE_AMOUNT', amount: number }
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

export function openStripeOverlay(amount: number, email: string): Action {
  stripeCheckout.openDialogBox(amount, email);
  return { type: 'OPEN_STRIPE_OVERLAY' };
}

export function setStripeAmount(amount: number): Action {
  return { type: 'SET_STRIPE_AMOUNT', amount };
}

export function setupStripeCheckout(): Function {

  return (dispatch, getState) => {

    const handleToken = (token) => {
      dispatch(setStripeCheckoutToken(token));

      const state = getState();

      fetch(MONTHLY_CONTRIB_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          contribution: {
            amount: state.stripeCheckout.amount,
            currency: state.stripeCheckout.currency,
          },
          paymentFields: {
            stripeToken: token.id,
          },
          country: state.monthlyContrib.country,
          firstName: state.monthlyContrib.firstName,
          lastName: state.monthlyContrib.lastName,
        }),
      }).then((response) => {
        if (response.ok) {
          window.location.assign('/monthly-contributions/thankyou');
        } else {
          return response.text();
        }
      }).then(console.log);
    };

    const handleCloseOverlay = () => dispatch(closeStripeOverlay());

    const stripeState = getState().stripeCheckout;

    dispatch(startStripeCheckout());

    return stripeCheckout.setup(stripeState, handleToken, handleCloseOverlay).then(() => {
      dispatch(stripeCheckoutLoaded());
    });

  };

}
