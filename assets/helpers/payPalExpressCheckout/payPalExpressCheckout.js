// @flow

// ----- Imports ----- //

import { payPalExpressError } from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';

// ----- Setup ----- //

const SETUP_PAYMENT_URL = '/paypal/setup-payment';
const CREATE_AGREEMENT_URL = '/paypal/create-agreement';


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

// ----- Auxiliary Functions -----//

function handleSetupResponse(response: Object) {
  let resp = null;
  if (response.status === 200) {
    resp = response.json();
  }

  return resp;
}

function payPalRequestData(bodyObj: Object, csrfToken: string) {

  const body = JSON.stringify(bodyObj);

  return {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrfToken },
    body,
  };
}

function setupPayment(dispatch: Function, state: Object) {

  const payPalState = state.payPalExpressCheckout;
  const csrfToken = state.csrf.token;

  return (resolve, reject) => {

    const requestBody = {
      amount: payPalState.amount,
      billingPeriod: payPalState.billingPeriod,
      currency: payPalState.currency,
    };

    fetch(SETUP_PAYMENT_URL, payPalRequestData(requestBody, csrfToken))
      .then(handleSetupResponse)
      .then((token) => {
        if (token) {
          resolve(token.token);
        } else {
          dispatch(payPalExpressError('PayPal token came back blank.'));
        }
      }).catch((err) => {
        dispatch(payPalExpressError(err.message));
        reject(err);
      });
  };
}

function createAgreement(payPalData: Object, state: Object) {
  const body = { token: payPalData.paymentToken };
  const csrfToken = state.csrf.token;

  return fetch(CREATE_AGREEMENT_URL, payPalRequestData(body, csrfToken))
    .then(response => response.json());
}

function setup(dispatch: Function, getState: Function, callback: Function) {

  return loadPayPalExpress()
    .then(() => {

      const handleBaId = (baid: Object) => {
        callback(baid.token, dispatch, getState);
      };

      const onAuthorize = (data) => {
        createAgreement(data, getState())
          .then(handleBaId)
          .catch((err) => {
            dispatch(payPalExpressError(err));
          });
      };

      const payPalOptions: Object = {
        env: window.guardian.payPalEnvironment,
        style: { color: 'blue', size: 'responsive' },

        // Defines whether user sees 'continue' or 'pay now' in overlay.
        commit: true,

        // This function is called when user clicks the PayPal button.
        payment: setupPayment(dispatch, getState()),

        // This function is called when the user finishes with PayPal interface (approves payment).
        onAuthorize,
      };
      const payPalId = 'component-paypal-button-checkout';
      const htmlElement = document.getElementById(payPalId);
      const elementCount: ?number = htmlElement ? htmlElement.childElementCount : null;

      if (elementCount === 0) {
        window.paypal.Button.render(payPalOptions, `#${payPalId}`);
      }

    });
}

export {
  setup, // eslint-disable-line import/prefer-default-export
};
