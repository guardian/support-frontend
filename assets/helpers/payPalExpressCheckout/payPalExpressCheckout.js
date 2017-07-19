// @flow

// ----- Imports ----- //

import type { State as PaypalState } from './payPalExpressCheckoutReducer';


// ----- Functions ----- //

const loadPayPalExpress = () => new Promise((resolve) => {

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

const setup = (
  state: PaypalState,
  setupPayment: Function,
  onAuthorize: Function,
) => loadPayPalExpress().then(() => {


  const payPalOptions: Object = {
    env: window.guardian.payPalEnvironment,
    style: { color: 'blue', size: 'responsive' },

    // Defines whether user sees 'continue' or 'pay now' in overlay.
    commit: true,

    // This function is called when user clicks the PayPal button.
    payment: setupPayment,

    // This function is called when the user finishes with PayPal interface (approves payment).
    onAuthorize,
  };

  window.paypal.Button.render(payPalOptions, '#component-paypal-button-checkout');
});


export {
  setup, // eslint-disable-line import/prefer-default-export
};
