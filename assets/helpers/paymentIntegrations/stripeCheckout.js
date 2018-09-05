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
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { OptimizeExperiments } from 'helpers/tracking/optimize';

import * as cookie from 'helpers/cookie';
import { logException } from 'helpers/logger';

// ----- Setup ----- //

let stripeHandler = null;

const ONEOFF_CONTRIB_ENDPOINT = window.guardian.paymentApiStripeEndpoint;

function stripeOneOffContributionEndpoint(testUser: ?string) {
  if (testUser) {
    return addQueryParamsToURL(
      ONEOFF_CONTRIB_ENDPOINT,
      { mode: 'test' },
    );
  }

  return ONEOFF_CONTRIB_ENDPOINT;
}

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

function requestData(
  abParticipations: Participations,
  paymentToken: string,
  currency: IsoCurrency,
  referrerAcquisitionData: ReferrerAcquisitionData,
  optimizeExperiments: OptimizeExperiments,
  getData: () => CheckoutData,
) {
  const { user, amount } = getData();

  const oneOffContribFields: PaymentApiStripeExecutePaymentBody = {
    paymentData: {
      currency,
      amount,
      token: paymentToken,
      email: user.email,
    },
    acquisitionData: derivePaymentApiAcquisitionData(referrerAcquisitionData, abParticipations, optimizeExperiments),
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(oneOffContribFields),
    credentials: 'include',
  };
}

function postToEndpoint(request: Object, onSuccess: Function, onError: Function): Promise<*> {
  return fetch(stripeOneOffContributionEndpoint(cookie.get('_test_username')), request)
    .then((response) => {
      if (response.ok) {
        onSuccess();
        return Promise.resolve();
      }
      return response.json().then((responseJson) => {
        if (responseJson.error.exceptionType === 'CardException') {
          onError('Your card has been declined.');
        } else {
          const errorHttpCode = responseJson.error.errorCode || 'unknown';
          const exceptionType = responseJson.error.exceptionType || 'unknown';
          const errorName = responseJson.error.errorName || 'unknown';
          logException(`Stripe payment attempt failed with following error: code: ${errorHttpCode} type: ${exceptionType} error-name: ${errorName}.`);
          onError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.');
        }
      });

    }).catch(() => {
      logException('Stripe payment attempt failed with unexpected error while attempting to process payment response');
      onError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.');
    });
}

function createTokenCallback({
  abParticipations, currencyId, referrerAcquisitionData,
  optimizeExperiments, getData, onSuccess, onError,
}: {
  abParticipations: Participations,
  currencyId: IsoCurrency,
  referrerAcquisitionData: ReferrerAcquisitionData,
  optimizeExperiments: OptimizeExperiments,
  getData: () => CheckoutData,
  onSuccess: () => void,
  onError: string => void,
}): (string) => Promise<*> {
  return (paymentToken: string) => {
    const request = requestData(
      abParticipations,
      paymentToken,
      currencyId,
      referrerAcquisitionData,
      optimizeExperiments,
      getData,
    );

    return postToEndpoint(request, onSuccess, onError);
  };
}

const loadStripe = () => new Promise((resolve) => {

  if (!window.StripeCheckout) {

    const script = document.createElement('script');

    script.onload = resolve;
    script.src = 'https://checkout.stripe.com/checkout.js';

    if (document.head) {
      document.head.appendChild(script);
    }

  } else {
    resolve();
  }

});

const getStripeKey = (currency: string, isTestUser: boolean) => {

  let stripeKey = null;

  switch (currency) {
    case 'AUD':
      stripeKey = isTestUser ?
        window.guardian.stripeKeyAustralia.uat : window.guardian.stripeKeyAustralia.default;
      break;
    default:
      stripeKey = isTestUser ?
        window.guardian.stripeKeyDefaultCurrencies.uat :
        window.guardian.stripeKeyDefaultCurrencies.default;
      break;
  }

  return stripeKey;
};

const setupStripeCheckout = (
  callback: (token: string) => Promise<*>,
  closeHandler: ?() => void,
  currency: string,
  isTestUser: boolean,
): Promise<void> => loadStripe().then(() => {

  const handleToken = (token) => {
    callback(token.id);
  };
  const defaultCloseHandler: () => void = () => {};

  const stripeKey = getStripeKey(currency, isTestUser);

  stripeHandler = window.StripeCheckout.configure({
    name: 'Guardian',
    description: 'Please enter your card details.',
    allowRememberMe: false,
    key: stripeKey,
    image: 'https://uploads.guim.co.uk/2018/01/15/gu.png',
    locale: 'auto',
    currency,
    token: handleToken,
    closed: closeHandler || defaultCloseHandler,
  });
});

const openDialogBox = (amount: number, email: string) => {
  if (stripeHandler) {
    stripeHandler.open({
      // Must be passed in pence.
      amount: amount * 100,
      email,
    });
  }
};

export {
  createTokenCallback,
  setupStripeCheckout,
  openDialogBox,
  getStripeKey,
};
