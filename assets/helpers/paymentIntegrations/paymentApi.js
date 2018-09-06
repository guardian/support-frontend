// @flow

import { routes } from 'helpers/routes';
import { addQueryParamsToURL } from 'helpers/url';
import {
  derivePaymentApiAcquisitionData,
  type ReferrerAcquisitionData,
  type PaymentAPIAcquisitionData,
  type OphanIds,
  type AcquisitionABTest,
} from 'helpers/tracking/acquisitions';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type BillingPeriod, type Contrib } from 'helpers/contributions';
import { type Participations } from 'helpers/abTests/abtest';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';
import { type UsState, type CaState, type IsoCountry } from 'helpers/internationalisation/country';
import { pollP } from 'helpers/promise';

import * as cookie from 'helpers/cookie';
import { logException } from 'helpers/logger';

// ----- Setup ----- //

const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;
const ONEOFF_CONTRIB_ENDPOINT = window.guardian.paymentApiStripeEndpoint;

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

type PayPalDetails = {| baid: string |};

type StripeDetails = {| stripeToken: string |};

type PaymentDetails = PayPalDetails | StripeDetails;

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

type PaymentFields 
  = {| tag: 'oneoff', fields: OneOffFields |}
  | {| tag: 'regular', fields: RegularFields |}
  ;

type Credentials = 'omit' | 'same-origin' | 'include';

type Token
  = {| tag: 'Stripe', token: string |}
  | {|tag: 'PayPal', token: string |}
  | {|tag: 'DirectDebit', accountHolderName: string, sortCode: string, accountNumber: string |}
  ;

type PaymentResult
  = {| tag: 'success' |}
  | {| tag: 'failure', error: string |}
  ;

const PaymentSuccess: PaymentResult = { tag: 'success' };

type PaymentCallback = Token => Promise<PaymentResult>;

type HttpMethod = 'POST' | 'GET';

// ----- Functions ----- //

function createRequestOptions(
  method: HttpMethod, 
  data: PaymentFields | null,
  credentials: Credentials, 
  csrf: CsrfState | null
): Object {
  const headers = csrf !== null
    ? { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' }
    : { 'Content-Type': 'application/json' };

  return {
    method,
    headers,
    body: data === null ? '' : JSON.stringify(data.fields),
    credentials,
  };
}

const requestPaymentApi: (string, Object) => Promise<Object> = (endpoint, init) =>
  fetch(endpoint, init).then(resp => resp.ok 
    ? resp.json() 
    : Promise.reject('There was an error processing your request. Please\u00a0try\u00a0again\u00a0later.')
  );

function stripeOneOffContributionEndpoint(testUser: ?string) {
  if (testUser) {
    return addQueryParamsToURL(
      ONEOFF_CONTRIB_ENDPOINT,
      { mode: 'test' },
    );
  }

  return ONEOFF_CONTRIB_ENDPOINT;
}

function postOneOffStripeRequest(data: PaymentFields): Promise<PaymentResult> {
  return requestPaymentApi(
    stripeOneOffContributionEndpoint(cookie.get('_test_username')),
    createRequestOptions('POST', data, 'include', null)
  ).then(json => {
    if (json.error) {
      if (json.error.exceptionType === 'CardException') {
        return { tag: 'failure', error: 'Your card has been declined.' };
      } else {
        const errorHttpCode = json.error.errorCode || 'unknown';
        const exceptionType = json.error.exceptionType || 'unknown';
        const errorName = json.error.errorName || 'unknown';
        return {
          tag: 'failure',
          error: `Stripe payment attempt failed with following error: code: ${errorHttpCode} type: ${exceptionType} error-name: ${errorName}.`
        };
      }
    }
    return json;
  });
}

function postRegularStripeRequest(data: PaymentFields, csrf: CsrfState): Promise<PaymentResult> {
  return requestPaymentApi(
    routes.recurringContribCreate,
    createRequestOptions('POST', data, 'same-origin', csrf)
  ).then(checkRegularStatus(csrf))
}

function checkRegularStatus(csrf: CsrfState): Object => Promise<PaymentResult> {
  return json => pollP(
    MAX_POLLS, 
    POLLING_INTERVAL,
    () => requestPaymentApi(json.trackingUri, createRequestOptions('GET', null, 'same-origin', csrf)),
    json => json.status === 'pending'
  ).then(json => {
    switch (json.status) {
      case 'success':
        return PaymentSuccess;
      
      default:
        return { tag: 'failure', error: json.message };
    }
  });
}

function createPaymentCallback(
  getData: (Contrib, Token) => PaymentFields,
  contributionType: Contrib,
  csrf: CsrfState
): PaymentCallback {
  return paymentToken => {
    const data = getData(contributionType, paymentToken);
    
    switch (paymentToken.tag) {
      case 'Stripe':
        switch (contributionType) {
          case 'ONE_OFF':
            return postOneOffStripeRequest(data);

          default:
            return postRegularStripeRequest(data, csrf);
        }
      case 'PayPal':
        // TODO
        return Promise.resolve(PaymentSuccess);

      case 'DirectDebit':
      default:
        // TODO
        return Promise.resolve(PaymentSuccess);
    }
  };
}

export {
  createPaymentCallback
};
