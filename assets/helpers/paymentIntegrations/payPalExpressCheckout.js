// @flow

// ----- Imports ----- //

import { logException } from 'helpers/logger';
import { routes } from 'helpers/routes';
import * as storage from 'helpers/storage';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Functions ----- //

function loadPayPalExpress(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.src = 'https://www.paypalobjects.com/api/checkout.js';
    if (document.head) {
      document.head.appendChild(script);
    }
  });
}

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
  amountToPay: number,
  currencyId: IsoCurrency,
  csrf: CsrfState,
) {
  const csrfToken = csrf.token;

  return (resolve, reject) => {
    storage.setSession('paymentMethod', 'PayPal');
    const requestBody = {
      amount: amountToPay,
      billingPeriod: 'monthly',
      currency: currencyId,
    };

    fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken || ''))
      .then(handleSetupResponse)
      .then((token) => {
        if (token) {
          resolve(token.token);
        } else {
          logException('PayPal token came back blank');
        }
      }).catch((err) => {
        logException(err.message);
        reject(err);
      });
  };
}

function createAgreement(payPalData: Object, csrf: CsrfState) {
  const body = { token: payPalData.paymentToken };
  const csrfToken = csrf.token;

  return fetch(routes.payPalCreateAgreement, payPalRequestData(body, csrfToken || ''))
    .then(response => response.json());
}

function setup(
  amount: number,
  currencyId: IsoCurrency,
  csrf: CsrfState,
  callback: (token: string) => Promise<*>,
): Promise<Object> {

  const handleBaId = (baid: Object) => {
    callback(baid.token);
  };

  const onAuthorize = (data) => {
    createAgreement(data, csrf)
      .then(handleBaId)
      .catch((err) => {
        logException(err.message);
      });
  };

  const payPalOptions: Object = {
    env: window.guardian.payPalEnvironment,
    style: { color: 'blue', size: 'responsive' },

    // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
    commit: true,

    // This function is called when user clicks the PayPal button.
    payment: setupPayment(amount, currencyId, csrf),

    // This function is called when the user finishes with PayPal interface (approves payment).
    onAuthorize,
  };

  return payPalOptions;
}


// ----- Exports ----- //

export {
  setup,
  loadPayPalExpress,
};
