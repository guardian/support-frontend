// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


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

function setupPayment(
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
  csrfToken: string,
) {

  const requestBody = {
    amount,
    billingPeriod,
    currency,
  };

  return fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken))
    .then(handleSetupResponse)
    .then((token) => {
      if (token) {
        return token.token;
      }
      throw new Error('Invalid token');
    });
}

function createAgreement(payPalData: Object, csrfToken: string) {
  const body = { token: payPalData.paymentToken };

  return fetch(routes.payPalCreateAgreement, payPalRequestData(body, csrfToken))
    .then(response => response.json());
}

function setup(
  csrfToken: string,
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
  callback: Function,
  failureCallback: (string) => void,
  payPalId: string,
) {

  return loadPayPalExpress()
    .then(() => {

      const handleBaId = (baid: Object) => {
        callback(baid.token);
      };

      const onAuthorize = (data) => {
        const htmlElement = document.getElementById(payPalId);

        const currentCsrfToken = (htmlElement ? htmlElement.dataset.csrfToken : null) || csrfToken;

        createAgreement(data, currentCsrfToken)
          .then(handleBaId)
          .catch(() => { });
      };

      const payPalOptions: Object = {
        env: window.guardian.payPalEnvironment,
        style: { color: 'blue', size: 'responsive' },

        // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
        commit: true,

        // This function is called when user clicks the PayPal button.

        payment: () => {

          const htmlElement = document.getElementById(payPalId);

          const dataset = htmlElement ? htmlElement.dataset : {};

          const currentAmount = Number(dataset.amount) || amount;
          const currentCurrency = ((dataset.currency: any): IsoCurrency) || currency;
          const currentBillingPeriod = dataset.billingPeriod || billingPeriod;
          const currentCsrfToken = dataset.csrfToken || csrfToken;

          return setupPayment(
            currentAmount,
            currentBillingPeriod,
            currentCurrency,
            currentCsrfToken,
          ).catch((err) => {
            failureCallback(err);
            throw err;
          });
        },

        // This function is called when the user finishes with PayPal interface (approves payment).
        onAuthorize,
      };

      const htmlElement = document.getElementById(payPalId);
      const elementCount: ?number = htmlElement ? htmlElement.childElementCount : null;

      if (htmlElement) {
        htmlElement.dataset.amount = String(amount);
        htmlElement.dataset.currency = String(currency);
        htmlElement.dataset.billingPeriod = billingPeriod;
        htmlElement.dataset.csrfToken = csrfToken;
      }

      if (elementCount === 0) {
        window.paypal.Button.render(payPalOptions, `#${payPalId}`);
      }

    });
}


// ----- Exports ----- //

export {
  setup,
};
