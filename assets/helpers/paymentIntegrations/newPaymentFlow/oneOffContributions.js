// @flow
import { type PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';

import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import { logPromise } from 'helpers/promise';
import { logException } from 'helpers/logger';
import { fetchJson, requestOptions } from 'helpers/fetch';
import * as cookie from 'helpers/cookie';
import { addQueryParamsToURL } from 'helpers/url';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

import { PaymentSuccess } from './readerRevenueApis';
import type { PaymentResult } from './readerRevenueApis';

// ----- Types ----- //

type UnexpectedError = {|
  type: 'unexpectedError',
  error: string,
|}

type PaymentApiError<E> = {|
  type: 'error',
  error: E,
|}

type PaymentApiSuccess<A> = {|
  type: 'success',
  data: A,
|}

export type PaymentApiResponse<E, A> = UnexpectedError | PaymentApiError<E> | PaymentApiSuccess<A>

// Models a PayPal payment being successfully created.
// The user should be redirected to the approvalUrl so that they can authorize the payment.
// https://github.com/guardian/payment-api/blob/master/src/main/scala/model/paypal/PaypalPaymentSuccess.scala
export type CreatePayPalPaymentSuccess = {|
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

export type CreatePayPalPaymentResponse = PaymentApiResponse<PayPalApiError, CreatePayPalPaymentSuccess>;

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

// ----- Functions ----- //

function unexpectedError(message: string): UnexpectedError {
  return {
    type: 'unexpectedError',
    error: message,
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
function paymentResultFromObject(json: Object): Promise<PaymentResult> {
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
    requestOptions(data, 'same-origin', 'POST', null),
  ).then(paymentResultFromObject));
}

// Object is expected to have structure:
// { type: "error", error: PayPalApiError }, or
// { type: "success", data: PaypalPaymentSuccess }
function createPayPalPaymentResponseFromObject(res: Object): CreatePayPalPaymentResponse {
  if (res.data && res.data.approvalUrl) {
    return { type: 'success', data: { approvalUrl: res.data.approvalUrl } };
  }
  if (res.error && res.error.message) {
    return { type: 'error', error: { message: res.error.message } };
  }

  const err = `unable to deserialize response from payment API: ${JSON.stringify(res)}`;
  logException(err);
  return unexpectedError(err);
}

function postOneOffPayPalCreatePaymentRequest(data: CreatePaypalPaymentData): Promise<CreatePayPalPaymentResponse> {
  return logPromise(fetchJson(
    paymentApiEndpointWithMode(window.guardian.paymentApiPayPalEndpoint),
    requestOptions(data, 'same-origin', 'POST', null),
  )).then(createPayPalPaymentResponseFromObject)
    .catch(err => unexpectedError(`error creating a PayPal payment: ${err}`));
}

export {
  postOneOffStripeExecutePaymentRequest,
  postOneOffPayPalCreatePaymentRequest,
};
