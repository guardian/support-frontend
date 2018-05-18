// @flow

// ----- Imports ----- //

import { addQueryParamsToURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import { derivePaymentApiAcquisitionData } from 'helpers/tracking/acquisitions';

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { Currency, IsoCurrency } from 'helpers/internationalisation/currency';
import type { PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';
import * as cookie from 'helpers/cookie';

import { checkoutError } from '../oneoffContributionsActions';

// ----- Setup ----- //

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

// ----- Functions ----- //

function requestData(
  abParticipations: Participations,
  paymentToken: string,
  currency: IsoCurrency,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
) {
  const { user } = getState().page;

  if (user.fullName !== null && user.fullName !== undefined &&
    user.email !== null && user.email !== undefined) {

    const oneOffContribFields: PaymentApiStripeExecutePaymentBody = {
      paymentData: {
        currency,
        amount,
        token: paymentToken,
        email: user.email,
      },
      acquisitionData: derivePaymentApiAcquisitionData(referrerAcquisitionData, abParticipations),
    };

    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oneOffContribFields),
      credentials: 'include',
    };
  }

  return Promise.resolve({
    ok: false,
    text: () => 'Failed to process payment - missing fields',
  });
}

export default function postCheckout(
  abParticipations: Participations,
  dispatch: Function,
  amount: number,
  currency: Currency,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
) {
  return (paymentToken: string) => {
    const request = requestData(
      abParticipations,
      paymentToken,
      currency.iso,
      amount,
      referrerAcquisitionData,
      getState,
    );

    return fetch(stripeOneOffContributionEndpoint(cookie.get('_test_username')), request).then((response) => {

      const url: string = addQueryParamsToURL(
        routes.oneOffContribThankyou,
        { INTCMP: referrerAcquisitionData.campaignCode },
      );

      if (response.ok) {
        window.location.assign(url);
        return;
      }

      dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
    }).catch(() => {
      dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
    });
  };
}
