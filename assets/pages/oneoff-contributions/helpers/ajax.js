// @flow

// ----- Imports ----- //

import { addQueryParamsToURL } from 'helpers/url';
import { derivePaymentApiAcquisitionData } from 'helpers/tracking/acquisitions';

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';
import type { OptimizeExperiments } from 'helpers/tracking/optimize';
import * as cookie from 'helpers/cookie';
import trackConversion from 'helpers/tracking/conversions';
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';
<<<<<<< HEAD

import { checkoutError, paymentSuccessful } from '../oneoffContributionsActions';
=======
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import type { StripeAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { checkoutError, checkoutSuccess } from '../oneoffContributionsActions';
>>>>>>> master


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

type PaymentApiError = {| type: string, error: Object |}

type OnSuccess = () => void;
type OnFailure = CheckoutFailureReason => void;


// ----- Functions ----- //

function requestData(
  abParticipations: Participations,
  stripeAuthorisation: StripeAuthorisation,
  currency: IsoCurrency,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
  optimizeExperiments: OptimizeExperiments,
) {
  const { user } = getState().page;

  if (user.fullName !== null && user.fullName !== undefined &&
    user.email !== null && user.email !== undefined) {

    const oneOffContribFields: PaymentApiStripeExecutePaymentBody = {
      paymentData: {
        currency,
        amount,
        token: stripeAuthorisation.token,
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

  return Promise.resolve({
    ok: false,
    text: () => 'Failed to process payment - missing fields',
  });
}

<<<<<<< HEAD
function postToEndpoint(
  request: Object,
  dispatch: Function,
  abParticipations: Participations,
  currencyId: IsoCurrency,
): Promise<*> {
  return fetch(stripeOneOffContributionEndpoint(cookie.get('_test_username')), request).then((response) => {
    if (response.ok) {
      trackConversion(abParticipations, routes.oneOffContribThankyou);
      dispatch(paymentSuccessful(currencyId, 'One-off', 'Stripe'));
    }
    return response.json();
  }).then((responseJson) => {
    if (responseJson.error.exceptionType === 'CardException') {
      dispatch(checkoutError('Your card has been declined.'));
    } else {
      const errorHttpCode = responseJson.error.errorCode || 'unknown';
      const exceptionType = responseJson.error.exceptionType || 'unknown';
      const errorName = responseJson.error.errorName || 'unknown';
      logException(`Stripe payment attempt failed with following error: code: ${errorHttpCode} type: ${exceptionType} error-name: ${errorName}.`);
      dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
    }
  }).catch(() => {
    logException('Stripe payment attempt failed with unexpected error while attempting to process payment response');
    dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
  });
=======
const handleFailure = (onFailure: OnFailure) => (paymentApiError: PaymentApiError): void => {
  const failureReason: CheckoutFailureReason = paymentApiError.error.failureReason ? paymentApiError.error.failureReason : 'unknown';
  onFailure(failureReason);
};

const handleResponse = (onSuccess: OnSuccess, onFailure: OnFailure) => (response): Promise<void> => {

  if (response.ok) {
    onSuccess();
    return Promise.resolve();
  }

  return response.json().then(handleFailure(onFailure));

};

const handleUnknownError = (onFailure: OnFailure) => () => {
  logException('Stripe payment attempt failed with unexpected error while attempting to process payment response');
  onFailure('unknown');
};

function postToEndpoint(request: Object, onSuccess: OnSuccess, onFailure: OnFailure): Promise<*> {

  return fetch(stripeOneOffContributionEndpoint(cookie.get('_test_username')), request)
    .then(handleResponse(onSuccess, onFailure))
    .catch(handleUnknownError(onFailure));

>>>>>>> master
}

function postCheckout(
  abParticipations: Participations,
  dispatch: Function,
  amount: number,
  currencyId: IsoCurrency,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
  optimizeExperiments: OptimizeExperiments,
): StripeAuthorisation => void {

  const onSuccess: OnSuccess = () => {
    trackConversion(abParticipations, routes.oneOffContribThankyou);
    dispatch(checkoutSuccess());
  };

  const onFailure: OnFailure = (checkoutFailureReason: CheckoutFailureReason) => {
    dispatch(checkoutError(checkoutFailureReason));
  };

  return (stripeAuthorisation: StripeAuthorisation) => {
    const request = requestData(
      abParticipations,
      stripeAuthorisation,
      currencyId,
      amount,
      referrerAcquisitionData,
      getState,
      optimizeExperiments,
    );

<<<<<<< HEAD
    return postToEndpoint(request, dispatch, abParticipations, currencyId);
=======
    postToEndpoint(request, onSuccess, onFailure);
>>>>>>> master
  };
}


// ----- Export ----- //

export default postCheckout;
