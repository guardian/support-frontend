// @flow

// ----- Imports ----- //

import { logException } from 'helpers/logger';
import { routes } from 'helpers/routes';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { setPayPalHasLoaded } from 'helpers/paymentIntegrations/payPalActions';

export type SetupPayPalRequestType = (
  resolve: string => void,
  reject: Error => void,
  IsoCurrency, CsrfState,
  amount: number,
  billingPeriod: BillingPeriod,
) => void

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

const showPayPal = (dispatch: Function) => {
  loadPayPalRecurring()
    .then(() => {
      dispatch(setPayPalHasLoaded());
    });
};


function payPalRequestData(bodyObj: Object, csrfToken: string) {
  return {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrfToken },
    body: JSON.stringify(bodyObj),
  };
}

// This is the recurring PayPal Express version of the PayPal checkout.
// It happens when the user clicks the PayPal button, and before the PayPal popup
// appears to allow the user to authorise the payment.
const setupRecurringPayPalPayment = (
  resolve: string => void,
  reject: Error => void,
  currency: IsoCurrency,
  csrf: CsrfState,
  amount: number,
  billingPeriod: BillingPeriod,
) =>
  (): void => {
    const csrfToken = csrf.token;
    storage.setSession('selectedPaymentMethod', 'PayPal');
    const requestBody = {
      amount,
      billingPeriod,
      currency,
    };

    fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken || ''))
      .then(response => (response.ok ? response.json() : null))
      .then((token: { token: string } | null) => {
        if (token) {
          resolve(token.token);
        } else {
          logException('PayPal token came back blank');
        }
      }).catch((err: Error) => {
        logException(err.message);
        reject(err);
      });
  };

function setupPayment(
  currencyId: IsoCurrency,
  csrf: CsrfState,
  amount: number,
  billingPeriod: BillingPeriod,
  setupPayPalPayment: SetupPayPalRequestType,
) {
  return (resolve, reject) => {
    setupPayPalPayment(resolve, reject, currencyId, csrf, amount, billingPeriod);
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
  amount: number,
  billingPeriod: BillingPeriod,
  setupPayPalPayment: SetupPayPalRequestType,
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

    onClick,

    // This function is called when user clicks the PayPal button.
    payment: setupPayment(currencyId, csrf, amount, billingPeriod, setupPayPalPayment),

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
  showPayPal,
  loadPayPalRecurring,
  payPalRequestData,
  setupRecurringPayPalPayment,
};
