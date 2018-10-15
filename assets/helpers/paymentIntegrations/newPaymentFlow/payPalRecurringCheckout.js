// @flow

// ----- Imports ----- //

import { logException } from 'helpers/logger';
import { routes } from 'helpers/routes';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Functions ----- //

function loadPayPalRecurring(): Promise<void> {
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
  currencyId: IsoCurrency,
  csrf: CsrfState,
  setupRecurringPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
) {
  return (resolve, reject) => {
    setupRecurringPayPalPayment(resolve, reject, currencyId, csrf);
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

function getPayPalOptions(
  currencyId: IsoCurrency,
  csrf: CsrfState,
  onPaymentAuthorisation: string => void,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  formClassName: string,
  isTestUser: boolean,
  setupRecurringPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
): Object {

  function toggleButton(actions): void {
    return canOpen() ? actions.enable() : actions.disable();
  }

  return {
    env: getPayPalEnvironment(isTestUser),

    style: { color: 'blue', size: 'responsive', label: 'pay' },

    // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
    commit: true,

    validate(actions) {
      // TODO: if we stored actions.enable and actions.disable in the state somewhere,
      // we could trigger the enable/disable from a redux action rather than bypassing
      // things with our own change handler.
      console.log('validate');
      toggleButton(actions);

      const form = document.querySelector(`.${formClassName}`);
      if (form instanceof HTMLElement) {
        // Thanks to event bubbling, we can just listen on the form element.
        // This means that we'll get change events even from form elements which
        // aren't in the DOM at the time this handler is bound.
        form.addEventListener('change', () => toggleButton(actions));
      } else {
        logException(`No form found with class ${formClassName}`);
      }
    },

    onClick() {
      if (!canOpen()) {
        whenUnableToOpen();
      }
    },

    // This function is called when user clicks the PayPal button.
    payment: setupPayment(currencyId, csrf, setupRecurringPayPalPayment),

    // This function is called when the user finishes with PayPal interface (approves payment).
    onAuthorize: (data) => {
      createAgreement(data, csrf)
        .then((baid: Object) => {
          onPaymentAuthorisation(baid.token);
        })
        .catch((err) => {
          logException(err.message);
        });
    },
  };
}


// ----- Exports ----- //

export {
  getPayPalOptions,
  loadPayPalRecurring,
  payPalRequestData,
};
