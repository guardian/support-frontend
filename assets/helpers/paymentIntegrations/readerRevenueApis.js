// @flow
import { routes } from 'helpers/routes';
import { addQueryParamsToURL } from 'helpers/url';
import {
  type ReferrerAcquisitionData,
  type PaymentAPIAcquisitionData,
  type OphanIds,
  type AcquisitionABTest,
} from 'helpers/tracking/acquisitions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type BillingPeriod } from 'helpers/contributions';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type Participations } from 'helpers/abTests/abtest';
import { type UsState, type CaState, type IsoCountry } from 'helpers/internationalisation/country';
import { pollUntilPromise, logPromise } from 'helpers/promise';
import { fetchJson } from 'helpers/fetch';
import trackConversion from 'helpers/tracking/conversions';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/payPalPaymentAPICheckout';

import * as cookie from 'helpers/cookie';

// ----- Types ----- //

// Data that should be posted to the payment API to create a Stripe charge.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/stripe/StripeChargeData.scala#L82
// TODO: are we deprecating signed-in email?
type StripeChargeData = {|
  paymentData: {
    currency: IsoCurrency,
    amount: number,
    token: string,
    email: string
  },
  acquisitionData: PaymentAPIAcquisitionData,
|};

export type OneOffPayPalCreatePaymentData = {|currency: string, amount: string|};

type RegularContribution = {|
  amount: number,
  currency: string,
  billingPeriod: BillingPeriod,
|};

// TODO: can we do away with these types and use the PaymentAuthorisation here?
// and thus do away with getPaymentFields and paymentDetailsFromAuthorisation
// (would probably require backend renaming)
export type PayPalDetails = {| baid: string |};

export type StripeDetails = {| stripeToken: string |};

export type DirectDebitDetails = {|
  accountHolderName: string,
  sortCode: string,
  accountNumber: string,
|};

// TODO: rename this type and its constituent types since the below structure is a bit baffling
// PaymentFields: {contributionType, fields: {...other stuff, paymentFields: PaymentDetails}}
export type PaymentDetails = PayPalDetails | StripeDetails | DirectDebitDetails;

type RegularFields = {|
  firstName: string,
  lastName: string,
  country: IsoCountry,
  state: UsState | CaState | null,
  email: string,
  contribution: RegularContribution,
  paymentFields: PaymentDetails,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: AcquisitionABTest[],
|};

// TODO: why is contributionType required?
export type StripeOneOffPaymentFields = {| contributionType: 'oneoff', fields: StripeChargeData |};
export type PayPalOneOffPaymentFields = {| contributionType: 'oneoff', fields: CreatePaypalPaymentData |};
export type RegularPaymentFields = {| contributionType: 'regular', fields: RegularFields |};

// TODO: is this union type required?
// It is a type of an argument passed to postRequestOptions(), but this could just be an object (?)
export type PaymentFields = StripeOneOffPaymentFields | PayPalOneOffPaymentFields | RegularPaymentFields;

type Credentials = 'omit' | 'same-origin' | 'include';

export type StripeAuthorisation = {| paymentMethod: 'Stripe', token: string |};
export type PayPalAuthorisation = {| paymentMethod: 'PayPal', token: string |};
export type DirectDebitAuthorisation = {|
  paymentMethod: 'DirectDebit',
  accountHolderName: string,
  sortCode: string,
  accountNumber: string
|};

export type PaymentAuthorisation = StripeAuthorisation | PayPalAuthorisation | DirectDebitAuthorisation;

export type PaymentResult
  = {| paymentStatus: 'success' |}
  | {| paymentStatus: 'failure', error: CheckoutFailureReason |};

// ----- Setup ----- //
const PaymentSuccess: PaymentResult = { paymentStatus: 'success' };
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;

// ----- Functions ----- //

/** Builds a `RequestInit` object for use with GET requests using the Fetch API */
function getRequestOptions(
  credentials: Credentials,
  csrf: CsrfState | null,
): Object {
  const headers = csrf !== null
    ? { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' }
    : { 'Content-Type': 'application/json' };

  return {
    method: 'GET',
    headers,
    credentials,
  };
}

/** Builds a `RequestInit` object for use with POST requests using the Fetch API */
function postRequestOptions(
  data: PaymentFields,
  credentials: Credentials,
  csrf: CsrfState | null,
): Object {
  // FIXME: flow does not recognise PaymentFields as having property fields -
  // perhaps we need to model PaymentFields differently?
  return { ...getRequestOptions(credentials, csrf), method: 'POST', body: JSON.stringify(data.fields) };
}

/**
 * Process the response for a regular payment from the recurring contribution endpoint.
 *
 * If the payment is:
 * - pending, then we start polling the API until it's done or some timeout occurs
 * - failed, then we bubble up an error value
 * - otherwise, we bubble up a success value
 */
function checkRegularStatus(
  participations: Participations,
  csrf: CsrfState,
  setGuestAccountCreationToken: (string) => void,
): Object => Promise<PaymentResult> {
  const handleCompletion = (json) => {
    switch (json.status) {
      case 'success':
      case 'pending':
        return PaymentSuccess;

      default:
        return { paymentStatus: 'failure', error: json.failureReason };
    }
  };

  // Exhaustion of the maximum number of polls is considered a payment success
  const handleExhaustedPolls = (error) => {
    if (error === undefined) {
      return Promise.resolve(PaymentSuccess);
    }
    throw error;

  };

  return (json) => {
    if (json.guestAccountCreationToken) {
      setGuestAccountCreationToken(json.guestAccountCreationToken);
    }
    switch (json.status) {
      case 'pending':
        return logPromise(pollUntilPromise(
          MAX_POLLS,
          POLLING_INTERVAL,
          () => {
            trackConversion(participations, routes.recurringContribPending);
            return fetchJson(json.trackingUri, getRequestOptions('same-origin', csrf));
          },
          json2 => json2.status === 'pending',
        ).then(handleCompletion, handleExhaustedPolls));

      default:
        return Promise.resolve(handleCompletion(json));
    }
  };
}

function paymentApiEndpointWithMode(url: string) {
  if (cookie.get('_test_username')) {
    return addQueryParamsToURL(
      url,
      { mode: 'test' },
    );
  }

  return url;
}

// Object is expected to have structure:
// { type: "error", error: { failureReason: string } }, or
// { type: "success", data: { currency: string, amount: number } }
function getPaymentResultFromOneOffStripeResponse(json: Object): Promise<PaymentResult> {
  if (json.error) {
    const failureReason: CheckoutFailureReason = json.error.failureReason ? json.error.failureReason : 'unknown';
    return Promise.resolve({ paymentStatus: 'failure', error: failureReason });
  }
  return Promise.resolve(PaymentSuccess);
}

// Sends a one-off payment request to the payment API and standardises the result
// https://github.com/guardian/payment-api/blob/master/src/main/resources/routes#L17
function postOneOffStripeExecutePaymentRequest(data: StripeOneOffPaymentFields): Promise<PaymentResult> {
  return logPromise(fetchJson(
    paymentApiEndpointWithMode(window.guardian.paymentApiStripeEndpoint),
    // TODO: do we really need to 'include' credentials since Payment API is unauthenticated?
    postRequestOptions(data, 'include', null),
  ).then(getPaymentResultFromOneOffStripeResponse));
}

// TODO: is unknown error a decent name?
type UnknownError = {|
  type: 'unknownError',
  error: string,
|}

function unknownError(message: string): UnknownError {
  return {
    type: 'unknownError',
    error: message,
  };
}

type PaymentApiError<E> = {|
  type: 'error',
  error: E,
|}

type PaymentApiSuccess<A> = {|
  type: 'success',
  data: A,
|}

export type PaymentApiResponse<E, A> = UnknownError | PaymentApiError<E> | PaymentApiSuccess<A>

// Models a PayPal payment being successfully created.
// The user should be redirected to the approvalUrl so that they can authorize the payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalPaymentSuccess.scala
// TODO: this should really be named something like CreatePayPalPaymentSuccess in the payment API
export type PayPalPaymentSuccess = {|
  // For brevity, unneeded fields are omitted
  approvalUrl: string,
  // paymentId: string,
|}

// Models a failure to create a PayPal payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalApiError.scala
export type PayPalApiError = {|
  // For brevity, unneeded fields are omitted
  // responseCode: number | null,
  // errorName: number | null,
  message: string,
|}

// Object is expected to have structure:
// { type: "error", error: PayPalApiError }, or
// { type: "success", data: PaypalPaymentSuccess }
function getPayPalResult(res: Object): PaymentApiResponse<PayPalApiError, PayPalPaymentSuccess> {
  if (res.data && res.data.approvalUrl) {
    return { type: 'success', data: { approvalUrl: res.data.approvalUrl } };
  }
  if (res.error && res.error.message) {
    return { type: 'error', error: { message: res.error.message } };
  }
  // This should never be returned.
  // If it is, then something has gone wrong!
  // TODO: alert on this error being returned
  return unknownError(`unable to deserialize response from payment API: ${JSON.stringify(res)}`);
}

type CreatePaymentResponse = Promise<PaymentApiResponse<PayPalApiError, PayPalPaymentSuccess>>

function postOneOffPayPalCreatePaymentRequest(data: CreatePaypalPaymentData): CreatePaymentResponse {
  return logPromise(fetchJson(
    paymentApiEndpointWithMode(window.guardian.paymentApiPayPalEndpoint),
    // TODO: if we remove the PaymentFields type then we can just pass the data through
    // TODO: do we really need to 'include' credentials since Payment API is unauthenticated?
    postRequestOptions({ contributionType: 'oneoff', fields: data }, 'include', null),
  )).then(getPayPalResult).catch(err => unknownError(`error creating a PayPal payment: ${err}`));
}

/** Sends a regular payment request to the recurring contribution endpoint and checks the result */
function postRegularPaymentRequest(
  data: PaymentFields,
  participations: Participations,
  csrf: CsrfState,
  setGuestAccountCreationToken: (string) => void,
): Promise<PaymentResult> {
  return logPromise(fetchJson(
    routes.recurringContribCreate,
    postRequestOptions(data, 'same-origin', csrf),
  ).then(checkRegularStatus(participations, csrf, setGuestAccountCreationToken)));
}

export {
  postOneOffStripeExecutePaymentRequest,
  postOneOffPayPalCreatePaymentRequest,
  postRegularPaymentRequest,
  PaymentSuccess,
};
