// @flow
import { routes } from 'helpers/routes';
import {
  type ReferrerAcquisitionData,
  type OphanIds,
  type AcquisitionABTest,
} from 'helpers/tracking/acquisitions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type BillingPeriod } from 'helpers/contributions';
import { type Participations } from 'helpers/abTests/abtest';
import { type UsState, type CaState, type IsoCountry } from 'helpers/internationalisation/country';
import { pollUntilPromise, logPromise } from 'helpers/promise';
import { fetchJson, getRequestOptions, postRequestOptions } from 'helpers/fetch';
import trackConversion from 'helpers/tracking/conversions';
import type { CreatePaypalPaymentData, StripeChargeData } from './oneOffContributions';


// ----- Types ----- //


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


/** Sends a regular payment request to the recurring contribution endpoint and checks the result */
function postRegularPaymentRequest(
  data: PaymentFields,
  participations: Participations,
  csrf: CsrfState,
  setGuestAccountCreationToken: (string) => void,
): Promise<PaymentResult> {
  return logPromise(fetchJson(
    routes.recurringContribCreate,
    postRequestOptions(data.fields, 'same-origin', csrf),
  ).then(checkRegularStatus(participations, csrf, setGuestAccountCreationToken)));
}

export {
  postRegularPaymentRequest,
  PaymentSuccess,
};
