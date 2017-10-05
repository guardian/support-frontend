// @flow

// ----- Imports ----- //

import type { State as StripeState } from './stripeCheckoutReducer';


// ----- Setup ----- //

let stripeHandler = null;


// ----- Functions ----- //

const loadStripe = () => new Promise((resolve) => {

  if (!window.StripeCheckout) {

    const script = document.createElement('script');

    script.onload = resolve;
    script.src = 'https://checkout.stripe.com/checkout.js';

    if (document.head) {
      document.head.appendChild(script);
    }

  } else {
    resolve();
  }

});

export const setup = (
  state: StripeState,
  isTestUser: boolean,
  token: Function,
  closed: Function,
): Promise<void> => loadStripe().then(() => {

  stripeHandler = window.StripeCheckout.configure({
    name: 'Guardian',
    description: 'Please enter your card details.',
    allowRememberMe: false,
    key: isTestUser ? window.guardian.stripeKey.uat : window.guardian.stripeKey.default,
    image: 'https://d24w1tjgih0o9s.cloudfront.net/gu.png',
    locale: 'auto',
    currency: state.currency,
    token,
    closed,
  });

});


export const openDialogBox = (amount: number, email: string) => {

  if (stripeHandler) {
    stripeHandler.open({
      // Must be passed in pence.
      amount: amount * 100,
      email,
    });
  }

};
