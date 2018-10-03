// @flow
import { type PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';

import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import { logPromise } from 'helpers/promise';
import { fetchJson, postRequestOptions } from 'helpers/fetch';
import * as cookie from 'helpers/cookie';
import { addQueryParamsToURL } from 'helpers/url';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

import { PaymentSuccess } from './readerRevenueApis';
import type { PaymentResult } from './readerRevenueApis';

function paymentApiEndpointWithMode(url: string) {
  if (cookie.get('_test_username')) {
    return addQueryParamsToURL(
      url,
      { mode: 'test' },
    );
  }

  return url;
}

// Data that should be posted to the payment API to create a Stripe charge.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/stripe/StripeChargeData.scala#L82
// TODO: are we deprecating signed-in email?
export type StripeChargeData = {|
  paymentData: {
    currency: IsoCurrency,
    amount: number,
    token: string,
    email: string
  },
  acquisitionData: PaymentAPIAcquisitionData,
|};


// Data that should be posted to the payment API to get a url for the PayPal UI
// where the user is redirected to so that they can authorize the payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalPaymentData.scala#L74
export type CreatePaypalPaymentData = {|
  currency: IsoCurrency,
  amount: number,
  // Specifies the url that PayPal should make a GET request to, should the user authorize the payment.
  // Path of url should be /paypal/rest/return (see routes file)
  returnURL: string,
  // Specifies the url that PayPal should make a GET request to, should the user not authorize the payment.
  cancelURL: string,
|}

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
function postOneOffStripeExecutePaymentRequest(data: StripeChargeData): Promise<PaymentResult> {
  return logPromise(fetchJson(
    paymentApiEndpointWithMode(window.guardian.paymentApiStripeEndpoint),
    // TODO: do we really need to 'include' credentials since Payment API is unauthenticated?
    postRequestOptions(data, 'include', null),
  ).then(getPaymentResultFromOneOffStripeResponse));
}

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
    postRequestOptions(data, 'include', null),
  )).then(getPayPalResult).catch(err => unknownError(`error creating a PayPal payment: ${err}`));
}

export {
  postOneOffStripeExecutePaymentRequest,
  postOneOffPayPalCreatePaymentRequest,
};
