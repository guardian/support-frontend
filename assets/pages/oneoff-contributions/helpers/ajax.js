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
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import type { StripeAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { checkoutError, paymentSuccessful } from '../oneoffContributionsActions';

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

const handleFailure = (onFailure: OnFailure) => (paymentApiError: PaymentApiError): void => {
  const failureReason: CheckoutFailureReason = paymentApiError.error.failureReason ? paymentApiError.error.failureReason : 'unknown';
  onFailure(failureReason);
};

const handleResponse = (onSuccess: OnSuccess, onFailure: OnFailure, currencyId: IsoCurrency) =>
  (response): Promise<void> => {

    if (response.ok) {
      paymentSuccessful(currencyId, 'One-off', 'Stripe');
      onSuccess();
      return Promise.resolve();
    }

    return response.json().then(handleFailure(onFailure));

  };

const handleUnknownError = (onFailure: OnFailure) => () => {
  logException('Stripe payment attempt failed with unexpected error while attempting to process payment response');
  onFailure('unknown');
};

function postToEndpoint(request: Object, onSuccess: OnSuccess, onFailure: OnFailure, currId: IsoCurrency): Promise<*> {

  return fetch(stripeOneOffContributionEndpoint(cookie.get('_test_username')), request)
    .then(handleResponse(onSuccess, onFailure, currId))
    .catch(handleUnknownError(onFailure));

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
    dispatch(paymentSuccessful(currencyId, 'One-off', 'Stripe'));
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

    postToEndpoint(request, onSuccess, onFailure, currencyId);
  };
}


// ----- Export ----- //

export default postCheckout;
export { paymentSuccessful };
