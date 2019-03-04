// @flow

import { setPayPalHasLoaded } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import { loadPayPalRecurring, payPalRequestData } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { ContributionType } from 'helpers/contributions';
import type { State } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import { billingPeriodFromContrib } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { logException } from 'helpers/logger';
import * as storage from 'helpers/storage';
import { finalPrice as dpFinalPrice } from 'helpers/productPrice/digitalProductPrices';


const showPayPal = (dispatch: Function) => {
  loadPayPalRecurring()
    .then(() => {
      dispatch(setPayPalHasLoaded());
    });
};

const setupPayPalPayment = (
  resolve: string => void,
  reject: Error => void,
  currency: IsoCurrency,
  csrf: Csrf,
  contributionType: ContributionType,
) =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    const csrfToken = csrf.token;
    const { price } = dpFinalPrice(
      state.page.checkout.productPrices,
      state.page.checkout.billingPeriod,
      state.common.internationalisation.countryId,
    );
    const billingPeriod = billingPeriodFromContrib(contributionType);
    storage.setSession('selectedPaymentMethod', 'PayPal');
    const requestBody = {
      amount: price,
      billingPeriod,
      currency,
    };

    fetch('/paypal/setup-payment', payPalRequestData(requestBody, csrfToken || ''))
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

export { showPayPal, setupPayPalPayment };
