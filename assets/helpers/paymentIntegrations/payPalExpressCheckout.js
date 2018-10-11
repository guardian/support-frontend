// @flow

// ----- Imports ----- //

import { logException } from 'helpers/logger';
import { routes } from 'helpers/routes';
import * as storage from 'helpers/storage';
import { formInputs } from 'helpers/checkoutForm/checkoutForm';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Contrib } from 'helpers/contributions';

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
    console.log('setupPayment');
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

function getPayPalEnvironment(isTestUser: boolean): string {
  return isTestUser ? window.guardian.payPalEnvironment.uat : window.guardian.payPalEnvironment.default;
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
  onPaymentAuthorisation: string => void,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  formClassName: string,
  isTestUser: boolean,
): Promise<Object> {

  const handleBaId = (baid: Object) => {
    onPaymentAuthorisation(baid.token);
  };

  const onAuthorize = (data) => {
    createAgreement(data, csrf)
      .then(handleBaId)
      .catch((err) => {
        logException(err.message);
      });
  };

  function addFormChangeListener(handler: () => void) {
    const form = document.querySelector(`.${formClassName}`);
    if (form instanceof HTMLElement) {
      // Thanks to event bubbling, we can just listen on the form element.
      // This means that we'll get change events even from form elements which
      // aren't in the DOM at the time this handler is bound.
      form.addEventListener('change', handler);
    } else {
      logException(`No form found with class ${formClassName}`);
    }
  }

  function toggleButton(actions): void {
    return canOpen() ? actions.enable() : actions.disable();
  }

  const payPalOptions: Object = {
    // TODO: default value is just to not break existing flow.
    // maybe just make a copy of this file instead?
    env: getPayPalEnvironment(isTestUser) || window.guardian.payPalEnvironment,

    // TODO: I think Iona also wanted a different colour for this, so another reason to copy-paste
    style: { color: 'blue', size: 'responsive', label: 'pay' },

    // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
    commit: true,

    validate(actions) {
      toggleButton(actions);
      addFormChangeListener(() => toggleButton(actions));
    },

    onClick() {
      if (!canOpen()) {
        whenUnableToOpen();
      }
    },

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
