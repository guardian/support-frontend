// ----- Imports ----- //
import { logException } from "helpers/utilities/logger";
import { routes } from "helpers/urls/routes";
import type { Csrf as CsrfState } from "helpers/csrf/csrfReducer";
import type { IsoCurrency } from "helpers/internationalisation/currency";
import * as storage from "helpers/storage/storage";
import type { BillingPeriod } from "helpers/productPrice/billingPeriods";
import { setPayPalHasLoaded } from "helpers/forms/paymentIntegrations/payPalActions";
import { PayPal } from "helpers/forms/paymentMethods";
import { billingPeriodFromContrib, getAmount } from "../../contributions";
import type { Csrf } from "../../csrf/csrfReducer";
import type { State } from "pages/contributions-landing/contributionsLandingReducer";
import type { Action } from "pages/contributions-landing/contributionsLandingActions";
import "pages/contributions-landing/contributionsLandingActions";
import type { Option } from "helpers/types/option";
export type SetupPayPalRequestType = (resolve: (arg0: string) => void, reject: (arg0: Error) => void, arg2: IsoCurrency, arg3: CsrfState, amount: number, billingPeriod: BillingPeriod) => void;
export type PayPalUserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  shipToStreet: string;
  shipToCity: string;
  shipToState: Option<string>;
  shipToZip: string;
  shipToCountryCode: string;
};
export type PayPalCheckoutDetails = {
  baid: string;
  user: Option<PayPalUserDetails>;
};

// ----- Functions ----- //
function loadPayPalRecurring(): Promise<void> {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.src = 'https://www.paypalobjects.com/api/checkout.js';

    if (document.head) {
      document.head.appendChild(script);
    }
  });
}

const showPayPal = (dispatch: (...args: Array<any>) => any) => {
  loadPayPalRecurring().then(() => {
    dispatch(setPayPalHasLoaded());
  });
};

function payPalRequestData(bodyObj: Record<string, any>, csrfToken: string) {
  return {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Csrf-Token': csrfToken
    },
    body: JSON.stringify(bodyObj)
  };
}

// This is the recurring PayPal equivalent of the "Create a payment" Step 1 described above.
// It happens when the user clicks the recurring PayPal button,
// before the PayPal popup in which they authorise the payment appears.
// It should probably be called createOneOffPayPalPayment but it's called setupPayment
// on the backend so pending a far-reaching rename, I'll keep the terminology consistent with the backend.
const setupRecurringPayPalPayment = (resolve: (arg0: string) => void, reject: (arg0: Error) => void, currency: IsoCurrency, csrf: Csrf) => (dispatch: (...args: Array<any>) => any, getState: () => State): void => {
  const state = getState();
  const csrfToken = csrf.token;
  const {
    contributionType
  } = state.page.form;
  const amount = getAmount(state.page.form.selectedAmounts, state.page.form.formData.otherAmounts, contributionType);
  const billingPeriod = billingPeriodFromContrib(contributionType);
  storage.setSession('selectedPaymentMethod', 'PayPal');
  const requestBody = {
    amount,
    billingPeriod,
    currency,
    requireShippingAddress: false
  };
  fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken || '')).then(response => response.ok ? response.json() : null).then((token: {
    token: string;
  } | null) => {
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

// This is the recurring PayPal Express version of the PayPal checkout.
// It happens when the user clicks the PayPal button, and before the PayPal popup
// appears to allow the user to authorise the payment.
const setupSubscriptionPayPalPayment = (resolve: (arg0: string) => void, reject: (arg0: Error) => void, currency: IsoCurrency, csrf: CsrfState, amount: number, billingPeriod: BillingPeriod, requireShippingAddress: boolean) => (): void => {
  const csrfToken = csrf.token;
  storage.setSession('selectedPaymentMethod', PayPal);
  const requestBody = {
    amount,
    billingPeriod,
    currency,
    requireShippingAddress
  };
  fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken || '')).then(response => response.ok ? response.json() : null).then((token: {
    token: string;
  } | null) => {
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

const setupSubscriptionPayPalPaymentNoShipping = (resolve: (arg0: string) => void, reject: (arg0: Error) => void, currency: IsoCurrency, csrf: CsrfState, amount: number, billingPeriod: BillingPeriod) => setupSubscriptionPayPalPayment(resolve, reject, currency, csrf, amount, billingPeriod, false);

const setupSubscriptionPayPalPaymentWithShipping = (resolve: (arg0: string) => void, reject: (arg0: Error) => void, currency: IsoCurrency, csrf: CsrfState, amount: number, billingPeriod: BillingPeriod) => setupSubscriptionPayPalPayment(resolve, reject, currency, csrf, amount, billingPeriod, true);

function setupPayment(currencyId: IsoCurrency, csrf: CsrfState, amount: number, billingPeriod: BillingPeriod, setupPayPalPayment: SetupPayPalRequestType) {
  return (resolve, reject) => {
    setupPayPalPayment(resolve, reject, currencyId, csrf, amount, billingPeriod);
  };
}

function getPayPalEnvironment(isTestUser: boolean): string {
  return isTestUser ? window.guardian.payPalEnvironment.uat : window.guardian.payPalEnvironment.default;
}

function createAgreement(payPalData: Record<string, any>, csrf: CsrfState) {
  const body = {
    token: payPalData.paymentToken
  };
  const csrfToken = csrf.token;
  return fetch(routes.payPalOneClickCheckout, payPalRequestData(body, csrfToken || '')).then(response => response.json());
}

function getPayPalOptions(currencyId: IsoCurrency, csrf: CsrfState, onPayPalCheckoutCompleted: (arg0: PayPalCheckoutDetails) => void, canOpen: () => boolean, onClick: () => void, formClassName: string, isTestUser: boolean, amount: number, billingPeriod: BillingPeriod, setupPayPalPayment: SetupPayPalRequestType, updatePayPalButtonReady: (arg0: boolean) => Action): Record<string, any> {
  function toggleButton(actions): void {
    return canOpen() ? actions.enable() : actions.disable();
  }

  return {
    env: getPayPalEnvironment(isTestUser),
    style: {
      color: 'blue',
      size: 'responsive',
      label: 'pay',
      tagline: false,
      layout: 'horizontal',
      fundingicons: false
    },
    // Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
    commit: true,

    validate(actions) {
      window.enablePayPalButton = actions.enable;
      window.disablePayPalButton = actions.disable;
      toggleButton(actions);
      updatePayPalButtonReady(true);
    },

    funding: {
      disallowed: [window.paypal.FUNDING.CREDIT]
    },
    onClick,
    // This function is called when user clicks the PayPal button.
    payment: setupPayment(currencyId, csrf, amount, billingPeriod, setupPayPalPayment),
    // This function is called when the user finishes with PayPal interface (approves payment).
    onAuthorize: data => {
      createAgreement(data, csrf).then((payPalCheckoutDetails: Record<string, any>) => {
        onPayPalCheckoutCompleted(payPalCheckoutDetails);
      }).catch(err => {
        logException(err.message);
      });
    }
  };
}

// ----- Exports ----- //
export { getPayPalOptions, showPayPal, loadPayPalRecurring, payPalRequestData, setupSubscriptionPayPalPaymentNoShipping, setupRecurringPayPalPayment, setupSubscriptionPayPalPaymentWithShipping };