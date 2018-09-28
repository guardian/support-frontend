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

import * as cookie from 'helpers/cookie';

// ----- Types ----- //

type OneOffFields = {|
  paymentData: {
    currency: IsoCurrency,
    amount: number,
    token: string,
    email: string
  },
  acquisitionData: PaymentAPIAcquisitionData,
|};

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

export type PaymentFields
  = {| contributionType: 'oneoff', fields: OneOffFields |}
  | {| contributionType: 'regular', fields: RegularFields |};

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
const ONEOFF_CONTRIB_ENDPOINT = window.guardian.paymentApiStripeEndpoint;

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
  return { ...getRequestOptions(credentials, csrf), method: 'POST', body: JSON.stringify(data.fields) };
}

/** Process the response for a one-off payment from the payment API */
function checkOneOffStatus(json: Object): Promise<PaymentResult> {
  if (json.error) {
    const failureReason: CheckoutFailureReason = json.error.failureReason ? json.error.failureReason : 'unknown';
    return Promise.resolve({ paymentStatus: 'failure', error: failureReason });
  }
  return Promise.resolve(PaymentSuccess);
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

/** Returns the URL for one-off payments (should probably be a `const` somewhere) */
function getOneOffStripeEndpoint() {
  if (cookie.get('_test_username')) {
    return addQueryParamsToURL(
      ONEOFF_CONTRIB_ENDPOINT,
      { mode: 'test' },
    );
  }

  return ONEOFF_CONTRIB_ENDPOINT;
}

/** Sends a one-off payment request to the payment API and checks the result */
function postOneOffStripeRequest(data: PaymentFields): Promise<PaymentResult> {
  return logPromise(fetchJson(
    getOneOffStripeEndpoint(),
    postRequestOptions(data, 'include', null),
  ).then(checkOneOffStatus));
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
  postOneOffStripeRequest,
  postRegularPaymentRequest,
  PaymentSuccess,
};
