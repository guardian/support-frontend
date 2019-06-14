// @flow
import { type PaymentAPIAcquisitionData } from 'helpers/tracking/acquisitions';

import type { ErrorReason } from 'helpers/errorReasons';
import { logPromise } from 'helpers/promise';
import { logException } from 'helpers/logger';
import { fetchJson, requestOptions } from 'helpers/fetch';
import * as cookie from 'helpers/cookie';
import { addQueryParamsToURL } from 'helpers/url';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

import { PaymentSuccess } from './readerRevenueApis';
import type { PaymentResult, StripePaymentMethod } from './readerRevenueApis';
import type { ThankYouPageStage } from 'pages/contributions-landing/contributionsLandingReducer';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';

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
    email: string,
    stripePaymentMethod: StripePaymentMethod,
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

export type UserSignInDetails = {
  hasAccount: boolean,
  hasFacebookSocialLink: boolean,
  hasGoogleSocialLink: boolean,
  hasPassword: boolean,
  isUserEmailValidated: boolean,
}

export type UserCohort = 'signed-in-verified' | 'signed-in-unverified' | 'signed-out-verified' | 'signed-out-unverified' | 'guest' | 'new' | null;

function renderThankYouPageWithCohort(
  userDetails: UserSignInDetails,
  signInToken: string | null,
  setGuestAccountCreationToken: (string) => void,
  setThankYouPageStage: (ThankYouPageStage) => void,
  setUserCohort: (UserCohort) => void,
) {
  const isSignedIn = doesUserAppearToBeSignedIn();
  const hasFullAccount = userDetails &&
    (userDetails.hasPassword || userDetails.hasFacebookSocialLink || userDetails.hasGoogleSocialLink);
  const isVerified = userDetails && userDetails.isUserEmailValidated;

  const isNewUser = !!signInToken;
  const isGuestUser = !isSignedIn && !hasFullAccount && !isNewUser;
  const isSignedOutVerifiedUser = !isSignedIn && hasFullAccount && isVerified;
  const isSignedOutUnverifiedUser = !isSignedIn && hasFullAccount && !isVerified;
  const isSignedInUnverifiedUser = isSignedIn && !isVerified;
  const isSignedInVerifiedUser = isSignedIn && isVerified;

  if (isNewUser && signInToken) {
    // Cohort 5 - "New"
    setUserCohort('new');
    setGuestAccountCreationToken(signInToken);
    setThankYouPageStage('thankYouSetPassword');
  }

  if (isGuestUser) {
    // Cohort 4 - "Guest"
    setUserCohort('guest');
    setThankYouPageStage('thankYouSetPassword');
  }

  if (isSignedOutVerifiedUser) {
    // Cohort 3a - "Signed out verified"
    setUserCohort('signed-out-verified');
    setThankYouPageStage('thankYou');
  }

  if (isSignedOutUnverifiedUser) {
    // Cohort 3b - "Signed out unverified"
    setUserCohort('signed-out-verified');
    setThankYouPageStage('thankYou');
  }

  if (isSignedInUnverifiedUser) {
    // Cohort 2 - "Signed in unverified"
    setUserCohort('signed-in-unverified');
    setThankYouPageStage('thankYou');
  }

  if (isSignedInVerifiedUser) {
    // Cohort 1 - "Signed in verified"
    setUserCohort('signed-in-verified');
    setThankYouPageStage('thankYou');
  }
}

// Object is expected to have structure:
// { type: "error", error: { failureReason: string } }
// OR
// { type: "success",
//   data: {
//     currency: string,
//     amount: number,
//     gustAccountCreationToken?: string,
//     userSignInDetails: {
//       hasAccount: boolean,
//       hasFacebookSocialLink: boolean,
//       hasGoogleSocialLink: boolean,
//       hasPassword: boolean,
//       isUserEmailValidated: boolean,
//     }
//   }
// }
function paymentResultFromObject(
  json: Object,
  setGuestAccountCreationToken: (string) => void,
  setThankYouPageStage: (ThankYouPageStage) => void,
  setUserCohort: (UserCohort) => void,
): Promise<PaymentResult> {
  if (json.error) {
    const failureReason: ErrorReason = json.error.failureReason ? json.error.failureReason : 'unknown';
    return Promise.resolve({ paymentStatus: 'failure', error: failureReason });
  }

  const signInToken = json.data && json.data.guestAccountCreationToken ?
    json.data.guestAccountCreationToken : null;

  if (json.data && json.data.userSignInDetails) {
    renderThankYouPageWithCohort(
      json.data.userSignInDetails,
      signInToken,
      setGuestAccountCreationToken,
      setThankYouPageStage,
      setUserCohort,
    );
  } else {
    setThankYouPageStage('thankYou');
  }

  return Promise.resolve(PaymentSuccess);
}

// Sends a one-off payment request to the payment API and standardises the result
// https://github.com/guardian/payment-api/blob/master/src/main/resources/routes#L17
function postOneOffStripeExecutePaymentRequest(
  data: StripeChargeData,
  setGuestAccountCreationToken: (string) => void,
  setThankYouPageStage: (ThankYouPageStage) => void,
  setUserCohort: (UserCohort) => void,
): Promise<PaymentResult> {
  return logPromise(fetchJson(
    paymentApiEndpointWithMode(window.guardian.paymentApiStripeEndpoint),
    requestOptions(data, 'omit', 'POST', null),
  ).then(result => paymentResultFromObject(result, setGuestAccountCreationToken, setThankYouPageStage, setUserCohort)));
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
    requestOptions(data, 'omit', 'POST', null),
  )).then(createPayPalPaymentResponseFromObject)
    .catch(err => unexpectedError(`error creating a PayPal payment: ${err}`));
}

export {
  postOneOffStripeExecutePaymentRequest,
  postOneOffPayPalCreatePaymentRequest,
  renderThankYouPageWithCohort,
};
