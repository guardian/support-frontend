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


import { addQueryParamsToURL } from 'helpers/url';
import {
  derivePaymentApiAcquisitionData,
  type ReferrerAcquisitionData,
  type PaymentAPIAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { type Participations } from 'helpers/abTests/abtest';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';

import * as cookie from 'helpers/cookie';
import { logException } from 'helpers/logger';

import { createPaymentCallback, type PaymentCallback, type PaymentResult } from './paymentApi';

// ----- Setup ----- //

let stripeHandler = null;

// ----- Types ----- //

type PaymentApiStripeExecutePaymentBody = {|
  paymentData: {
    currency: IsoCurrency,
    amount: number,
    token: string,
    email: string
  },
  acquisitionData: PaymentAPIAcquisitionData,
|};

type CheckoutData = {|
  user: {
    fullName: string,
    email: string,
  },
  amount: number
|};

// ----- Functions ----- //

// function requestData(
//   abParticipations: Participations,
//   paymentToken: string,
//   currency: IsoCurrency,
//   referrerAcquisitionData: ReferrerAcquisitionData,
//   optimizeExperiments: OptimizeExperiments,
//   getData: () => CheckoutData,
// ) {
//   const { user, amount } = getData();

//   const oneOffContribFields: PaymentApiStripeExecutePaymentBody = {
//     paymentData: {
//       currency,
//       amount,
//       token: paymentToken,
//       email: user.email,
//     },
//     acquisitionData: derivePaymentApiAcquisitionData(referrerAcquisitionData, abParticipations, optimizeExperiments),
//   };

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
  } else {
    return Promise.resolve();
  }
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
    const innerPromise = new Promise((resolve2, reject2) => {
      const handleToken = (token) => {
        callback({ tag: 'Stripe', token: token.id }).then(resolve2, reject2);
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
        innerPromise
      ]);
    });
  }));
}

function openDialogBox(stripeHandler: Object) {
  return (amount: number, email: string) => {
    stripeHandler.open({
      // Must be passed in pence.
      amount: amount * 100,
      email,
    });
  }
}

export {
  setupStripeCheckout,
  openDialogBox,
  getStripeKey,
};
