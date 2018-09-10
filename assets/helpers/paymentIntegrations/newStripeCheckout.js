// @flow

/**
 * This module contains a copy of pages/oneoff-contributions/helpers/ajax so that
 * the new payment flow can use this code without any impact on the existing
 * infrastructure.
 *
 * There are a couple of differences though:
 * - the amount: instead of fixing it when the callback is created, it should
 *   be provided by the `getState` function
 * - the actions: what happens upon error/success is view-dependent, so the
 *   actions are provided as parameters too. As a result, `dispatch` can
 *   go away (which makes the module completely independant of React)
 * - tracking conversions: this should be decoupled from the payment itself and
 *   moved upstream, in the success handler
 *
 * The latter module can be removed entirely once the new payment flow becomes the one
 * and only contribution endpoint.
 */

import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type PaymentCallback, type PaymentResult } from './paymentApi';

// ----- Functions ----- //

function loadStripe(): Promise<void> {
  if (!window.StripeCheckout) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.onload = resolve;
      script.onerror = reject;
      script.src = 'https://checkout.stripe.com/checkout.js';

      if (document.head) {
        document.head.appendChild(script);
      }
    });
  }
  return Promise.resolve();

}

function getStripeKey(currency: IsoCurrency, isTestUser: boolean): string {
  switch (currency) {
    case 'AUD':
      return isTestUser ?
        window.guardian.stripeKeyAustralia.uat : window.guardian.stripeKeyAustralia.default;
    default:
      return isTestUser ?
        window.guardian.stripeKeyDefaultCurrencies.uat :
        window.guardian.stripeKeyDefaultCurrencies.default;
  }
}

function setupStripeCheckout(
  callback: PaymentCallback,
  currency: IsoCurrency,
  isTestUser: boolean,
): Promise<[Object, Promise<PaymentResult>]> {
  return loadStripe().then(() => new Promise((resolve1) => {
    const deferred = {
      promise: (null: any),
      resolve: (null: any),
      reject: (null: any),
    };

    deferred.promise = new Promise((resolve2, reject2) => {
      deferred.resolve = resolve2;
      deferred.reject = reject2;
    });

    /** 
     * The callback returns a promise that we want to catch at the calling site
     * in order to process the result of the payment (i.e. send data too the payment API).
     * Sadly, Promises in JavaScript can only be resolved/rejected form the inside 😭
     * There's no other choice but to use the trick above to leak the resolution/rejection
     * handlers out of the scope of the Promise, so we can call them inside the callback.
     */
    const handleToken = (token) => {
      callback({ paymentMethod: 'Stripe', token: token.id }).then(deferred.resolve, deferred.reject);
    };

    const stripeKey = getStripeKey(currency, isTestUser);

    resolve1([
      window.StripeCheckout.configure({
        name: 'Guardian',
        description: 'Please enter your card details.',
        allowRememberMe: false,
        key: stripeKey,
        image: 'https://uploads.guim.co.uk/2018/01/15/gu.png',
        locale: 'auto',
        currency,
        token: handleToken,
      }),
      deferred.promise,
    ]);
  }));
}

function openDialogBox(stripeHandler: Object, amount: number, email: string) {
  stripeHandler.open({
    // Must be passed in pence.
    amount: amount * 100,
    email,
  });
}

export {
  setupStripeCheckout,
  openDialogBox,
  getStripeKey,
};
