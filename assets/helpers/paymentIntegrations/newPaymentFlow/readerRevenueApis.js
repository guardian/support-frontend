// @flow
import { routes } from 'helpers/routes';
import {
  type AcquisitionABTest,
  type OphanIds,
  type ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type BillingPeriod } from 'helpers/contributions';
import { type Participations } from 'helpers/abTests/abtest';
import { type CaState, type IsoCountry, type UsState } from 'helpers/internationalisation/country';
import { logPromise, pollUntilPromise } from 'helpers/promise';
import { logException } from 'helpers/logger';
import { fetchJson, getRequestOptions, requestOptions } from 'helpers/fetch';
import trackConversion from 'helpers/tracking/conversions';

import { type ThankYouPageStage } from '../../../pages/new-contributions-landing/contributionsLandingReducer';

// ----- Types ----- //

type RegularContribution = {|
  amount: number,
  currency: string,
  billingPeriod: BillingPeriod,
|};

type RegularPayPalPaymentFields = {| baid: string |};

type RegularStripePaymentFields = {| stripeToken: string |};

type RegularDirectDebitPaymentFields = {|
  accountHolderName: string,
  sortCode: string,
  accountNumber: string,
|};

export type RegularPaymentFields =
  RegularPayPalPaymentFields |
  RegularStripePaymentFields |
  RegularDirectDebitPaymentFields;

export type RegularPaymentRequest = {|
  firstName: string,
  lastName: string,
  country: IsoCountry,
  state: UsState | CaState | null,
  email: string,
  contribution: RegularContribution,
  paymentFields: RegularPaymentFields,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: AcquisitionABTest[],
  visitToken: ?string,
|};

export type StripeAuthorisation = {| paymentMethod: 'Stripe', token: string |};
export type PayPalAuthorisation = {| paymentMethod: 'PayPal', token: string |};
export type DirectDebitAuthorisation = {|
  paymentMethod: 'DirectDebit',
  accountHolderName: string,
  sortCode: string,
  accountNumber: string
|};

// Represents an authorisation to execute payments with a given payment method.
// This will generally be supplied by third-party code (Stripe, PayPal, GoCardless).
// It applies both to one-off payments, where it is sent to the Payment API which
// immediately executes the payment, and recurring, where it ultimately ends up in Zuora
// which uses it to execute payments in the future.
export type PaymentAuthorisation = StripeAuthorisation | PayPalAuthorisation | DirectDebitAuthorisation;

// Represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// The only method/type combination which will not make use of this PayPal one-off,
// because the end of that checkout happens on the backend after the user is redirected to our site.
export type PaymentResult
  = {| paymentStatus: 'success' |}
  | {| paymentStatus: 'failure', error: CheckoutFailureReason |};

// ----- Setup ----- //
const PaymentSuccess: PaymentResult = { paymentStatus: 'success' };
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;

// ----- Functions ----- //

function regularPaymentFieldsFromAuthorisation(authorisation: PaymentAuthorisation): RegularPaymentFields {
  switch (authorisation.paymentMethod) {
    case 'Stripe':
      return { stripeToken: authorisation.token };
    case 'PayPal':
      return { baid: authorisation.token };
    case 'DirectDebit':
      return {
        accountHolderName: authorisation.accountHolderName,
        sortCode: authorisation.sortCode,
        accountNumber: authorisation.accountNumber,
      };
    // TODO: what is a sane way to handle such cases?
    default:
      throw new Error('If Flow works, this cannot happen');
  }
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
  setThankYouPageStage: (ThankYouPageStage) => void,
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
      setThankYouPageStage('setPassword');
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
  data: RegularPaymentRequest,
  participations: Participations,
  csrf: CsrfState,
  setGuestAccountCreationToken: (string) => void,
  setThankYouPageStage: (ThankYouPageStage) => void,
): Promise<PaymentResult> {
  return logPromise(fetchJson(
    routes.recurringContribCreate,
    requestOptions(data, 'same-origin', 'POST', csrf),
  ).then(checkRegularStatus(participations, csrf, setGuestAccountCreationToken, setThankYouPageStage)));
}

function setPasswordGuest(
  password: string,
  guestAccountRegistrationToken: string,
  csrf: CsrfState,
): Promise<boolean> {

  const data = { password, guestAccountRegistrationToken };
  return logPromise(fetch(`${routes.contributionsSetPasswordGuest}`, requestOptions(data, 'same-origin', 'PUT', csrf)))
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      logException('/contribute/set-password-guest endpoint returned an error');
      return false;

    })
    .catch(() => {
      logException('Error while trying to interact with /contribute/set-password-guest');
      return false;
    });
}

export {
  postRegularPaymentRequest,
  regularPaymentFieldsFromAuthorisation,
  PaymentSuccess,
  setPasswordGuest,
};
