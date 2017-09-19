// @flow

// ----- Imports ----- //

import { payPalExpressError } from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';
import { routes } from 'helpers/routes';
import type { PageState, CombinedState } from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';


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

function setupPayment(dispatch: Function, state: CombinedState) {

  const payPalState = state.payPalExpressCheckout;
  const csrfToken = state.csrf.token;

  return (resolve, reject) => {

    const requestBody = {
      amount: payPalState.amount,
      billingPeriod: payPalState.billingPeriod,
      currency: payPalState.currency,
    };

    fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken || ''))
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

function createAgreement(payPalData: Object, state: CombinedState) {
  const body = { token: payPalData.paymentToken };
  const csrfToken = state.csrf.token;

  return fetch(routes.payPalCreateAgreement, payPalRequestData(body, csrfToken || ''))
    .then(response => response.json());
}

function setup(
  dispatch: Function,
  getState: () => PageState, callback: Function): Promise<void> {

  return loadPayPalExpress()
    .then(() => {

      const handleBaId = (baid: Object) => {
        callback(baid.token, dispatch, getState);
      };

      const onAuthorize = (data) => {
        createAgreement(data, getState().page)
          .then(handleBaId)
          .catch((err) => {
            dispatch(payPalExpressError(err));
          });
      };

      const payPalOptions: Object = {
        env: window.guardian.payPalEnvironment,
        style: { color: 'blue', size: 'responsive' },

        // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
        commit: true,

        // This function is called when user clicks the PayPal button.
        payment: setupPayment(dispatch, getState().page),

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


// ----- Exports ----- //

export {
  setup,
};
