// @flow

// ----- Imports ----- //

import { logException } from 'helpers/logger';
import { routes } from 'helpers/routes';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ContributionType } from 'helpers/contributions';

// ----- Types ----- //

export type PayPalButtonToggler = {
  enable: () => void,
  disable: () => void
};

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

function payPalRequestData(bodyObj: Object, csrfToken: string) {
  return {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrfToken },
    body: JSON.stringify(bodyObj),
  };
}

function setupPayment(
  currencyId: IsoCurrency,
  csrf: CsrfState,
  contributionType: ContributionType,
  setupRecurringPayPalPayment: (
    resolve: string => void,
    reject: Error => void,
    IsoCurrency, CsrfState,
    contributionType: ContributionType
  ) => void,
) {
  return (resolve, reject) => {
    setupRecurringPayPalPayment(resolve, reject, currencyId, csrf, contributionType);
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

let validateCalled;

function getPayPalOptions(
  currencyId: IsoCurrency,
  csrf: CsrfState,
  onPaymentAuthorisation: string => void,
  canOpen: () => boolean,
  onClick: () => void,
  formClassName: string,
  isTestUser: boolean,
  contributionType: ContributionType,
  setupRecurringPayPalPayment: (
    resolve: string => void,
    reject: Error => void,
    IsoCurrency,
    CsrfState,
    contributionType: ContributionType
  ) => void,
): Object {

  function toggleButton(actions): void {
    return canOpen() ? actions.enable() : actions.disable();
  }

  return {
    env: getPayPalEnvironment(isTestUser),

    style: {
      color: 'blue',
      size: 'responsive',
      label: 'pay',
      layout: 'horizontal',
      fundingicons: false,
    },

    // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
    commit: true,

    // This gets called when the button is first initialised, i.e. when the iframe loads.
    // If all is working correctly, it should not be called multiple times because we
    // should never be re-loading the iframe.
    validate(actions) {
      if (validateCalled) {
        logException('PayPal recurring button should only be loaded once');
        return;
      }

      window.enablePayPalButton = actions.enable;
      window.disablePayPalButton = actions.disable;

      validateCalled = true;
      toggleButton(actions);

    },

    funding: {
      disallowed: [window.paypal.FUNDING.CREDIT],
    },

    onClick() {
      onClick();
    },

    // This function is called when user clicks the PayPal button.
    payment: setupPayment(currencyId, csrf, contributionType, setupRecurringPayPalPayment),

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
