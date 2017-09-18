// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

type PayPalExpressCheckoutConfig = {
  amount: number,
  currency: IsoCurrency,
  billingPeriod: string,
  csrfToken: string,
};

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

function storeConfiguration(
  payPalId: string,
  config: PayPalExpressCheckoutConfig,
) {
  const htmlElement = document.getElementById(payPalId);

  if (htmlElement) {
    htmlElement.dataset.amount = String(config.amount);
    htmlElement.dataset.currency = String(config.currency);
    htmlElement.dataset.billingPeriod = config.billingPeriod;
    htmlElement.dataset.csrfToken = config.csrfToken;
  }
}

function retrieveConfiguration(
  payPalId: string,
  fallbackConfig: PayPalExpressCheckoutConfig,
): PayPalExpressCheckoutConfig {
  const htmlElement = document.getElementById(payPalId);

  const dataset = htmlElement ? htmlElement.dataset : {};

  return {
    amount: Number(dataset.amount) || fallbackConfig.amount,
    currency: ((dataset.currency: any): IsoCurrency) || fallbackConfig.currency,
    billingPeriod: dataset.billingPeriod || fallbackConfig.billingPeriod,
    csrfToken: dataset.csrfToken || fallbackConfig.csrfToken,
  };
}

function setupPayment(
  payPalId: string,
  fallbackConfig: PayPalExpressCheckoutConfig,
  failureCallback: Function,
) {

  return () => {
    const config = retrieveConfiguration(payPalId, fallbackConfig);

    const requestBody = {
      amount: config.amount,
      billingPeriod: config.billingPeriod,
      currency: config.currency,
    };

    return fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, config.csrfToken))
      .then(handleSetupResponse)
      .then((token) => {
        if (token) {
          return token.token;
        }
        throw new Error('Invalid token');
      }).catch((err) => {
        failureCallback(err);
        throw err;
      });
  };
}

function createAgreement(payPalData: Object, csrfToken: string) {
  const body = { token: payPalData.paymentToken };

  return fetch(routes.payPalCreateAgreement, payPalRequestData(body, csrfToken))
    .then(response => response.json());
}

function onAuthorize(
  payPalId: string,
  fallbackConfig: PayPalExpressCheckoutConfig,
  callback: Function,
) {
  return (data) => {
    const currentCsrfToken = retrieveConfiguration(payPalId, fallbackConfig).csrfToken;
    return createAgreement(data, currentCsrfToken)
      .then((baid: Object) => {
        return callback(baid.token);
      })
      .catch(() => { });
  };
}

function setup(
  csrfToken: string,
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
  successCallback: Function,
  failureCallback: (string) => void,
  payPalId: string,
) {

  const fallbackConfig: PayPalExpressCheckoutConfig = {
    csrfToken,
    billingPeriod,
    currency,
    amount,
  };

  return loadPayPalExpress()
    .then(() => {

      const payPalOptions: Object = {
        env: window.guardian.payPalEnvironment,
        style: { color: 'blue', size: 'responsive' },

        // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
        commit: true,

        // This function is called when user clicks the PayPal button.
        // See https://github.com/paypal/paypal-checkout/blob/master/docs/button.md#advanced-integration
        payment: setupPayment(payPalId, fallbackConfig, failureCallback),

        // This function is called when the user finishes with PayPal interface (approves payment).
        onAuthorize: onAuthorize(payPalId, fallbackConfig, successCallback),
      };

      storeConfiguration(payPalId, fallbackConfig);

      const htmlElement = document.getElementById(payPalId);
      const elementCount = htmlElement ? htmlElement.childElementCount : null;

      if (elementCount === 0) {
        window.paypal.Button.render(payPalOptions, `#${payPalId}`);
      }

    });
}


// ----- Exports ----- //

export {
  setup,
};
