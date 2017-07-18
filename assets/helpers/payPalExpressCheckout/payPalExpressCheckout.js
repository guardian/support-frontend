// @flow

// ----- Imports ----- //

import type { State as PaypalState } from './payPalExpressCheckoutReducer';


// ----- Functions ----- //

const loadPaypalExpress = () => new Promise((resolve) => {

  if (!window.paypal) {

    const script = document.createElement('script');

    script.onload = resolve;
    script.src = 'https://www.paypalobjects.com/api/checkout.js';

    if (document.head) {
      document.head.appendChild(script);
    }

  } else {
    resolve();
  }

});

export const setup = (
  state: PaypalState,
  setupPayment: Function,
  onAuthorize: Function,
) => loadPaypalExpress().then(() => {


  const payPalOptions: Object = {
    // Sets the environment.
    env: window.guardian.payPalEnvironment,
    // Styles the button.
    style: {color: 'blue', size: 'responsive'},
    // Defines whether user sees 'continue' or 'pay now' in overlay.
    commit: true,

    // Called when user clicks Paypal button.
    payment: setupPayment,

    // Called when user finishes with Paypal interface (approves payment).
    onAuthorize,
  };

  window.paypal.Button.render(payPalOptions, '#component-paypal-button-checkout');
});
