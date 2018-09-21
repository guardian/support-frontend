// @flow

// ----- Imports ----- //


import { routes } from 'helpers/routes';
import { getOphanIds } from 'helpers/tracking/acquisitions';
import type { Dispatch } from 'redux';
import type { BillingPeriod, Contrib } from 'helpers/contributions';
import type { ReferrerAcquisitionData, OphanIds, AcquisitionABTest } from 'helpers/tracking/acquisitions';
import type { UsState, IsoCountry } from 'helpers/internationalisation/country';
import { getSupportAbTests } from 'helpers/tracking/acquisitions';
import type { User as UserState } from 'helpers/user/userReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abTests/abtest';
import type { Token } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import trackConversion from 'helpers/tracking/conversions';
import { billingPeriodFromContrib } from 'helpers/contributions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { PaymentMethod } from 'helpers/checkouts';
import type { OptimizeExperiments } from 'helpers/tracking/optimize';
import { checkoutPending, checkoutSuccess, checkoutError, creatingContributor, setGuestAccountCreationToken } from '../regularContributionsActions';

// ----- Setup ----- //

const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;


// ----- Types ----- //

type ContributionRequest = {
  amount: number,
  currency: string,
  billingPeriod: BillingPeriod,
};

type PaymentFieldName = 'baid' | 'stripeToken' | 'directDebitData';

type PayPalDetails = {|
  'baid': string
|};

type StripeDetails = {|
  stripeToken: string,
|};

type DirectDebitDetails= {|
  accountHolderName: string,
  sortCode: string,
  accountNumber: string
|};

type RegularContribFields = {|
  firstName: ?string,
  lastName: ?string,
  country: IsoCountry,
  state?: UsState,
  contribution: ContributionRequest,
  paymentFields: PayPalDetails | StripeDetails | DirectDebitDetails,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: AcquisitionABTest[],
  email: ?string
|};

// https://github.com/guardian/support-models/blob/master/src/main/scala/com/gu/support/workers/model/Status.scala
type Status = 'success' | 'failure' | 'pending';

type StatusResponse = {|
  status: Status,
  trackingUri: string,
  failureReason: CheckoutFailureReason,
  guestAccountCreationToken?: string
|}

// ----- Functions ----- //

const isUserValid = (user: UserState) =>
  user.firstName !== null && user.firstName !== undefined &&
  user.lastName !== null && user.lastName !== undefined &&
  user.email !== null && user.email !== undefined;

const paymentMethodToPaymentFieldMap = {
  DirectDebit: 'directDebitData',
  PayPal: 'baid',
  Stripe: 'stripeToken',
};

const getPaymentFields =
  (token: Token): ?(PayPalDetails | StripeDetails | DirectDebitDetails) => {
    let response = null;
    switch (token.paymentMethod) {
      case 'PayPal':
        response = {
          baid: token.token,
        };
        break;
      case 'Stripe':
        response = {
          stripeToken: token.token,
        };
        break;
      case 'DirectDebit':
        response = {
          accountHolderName: token.accountHolderName,
          sortCode: token.sortCode,
          accountNumber: token.accountNumber,
        };
        break;
      default:
        response = null;
    }

    return response;
  };

function requestData(
  abParticipations: Participations,
  amount: number,
  contributionType: Contrib,
  currency: IsoCurrency,
  csrf: CsrfState,
  paymentFieldName: PaymentFieldName,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
  token: Token,
  optimizeExperiments: OptimizeExperiments,
) {

  const { user } = getState().page;
  const country = getState().common.internationalisation.countryId;

  if (!isUserValid(user)) {
    return Promise.resolve({
      ok: false,
      text: () => 'Failed to process payment - missing fields',
    });
  }

  const ophanIds: OphanIds = getOphanIds();
  const supportAbTests = getSupportAbTests(abParticipations, optimizeExperiments);
  const paymentFields = getPaymentFields(token);

  if (!paymentFields) {
    return Promise.resolve({
      ok: false,
      text: () => 'Failed to process payment - error related to payment fields.',
    });
  }

  const regularContribFields: RegularContribFields = {
    firstName: user.firstName,
    lastName: user.lastName,
    country,
    contribution: {
      amount,
      currency,
      billingPeriod: billingPeriodFromContrib(contributionType),
    },
    paymentFields,
    ophanIds,
    referrerAcquisitionData,
    supportAbTests,
    email: user.email,
  };

  if (user.stateField) {
    regularContribFields.state = user.stateField;
  }

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
    credentials: 'same-origin',
    body: JSON.stringify(regularContribFields),
  };
}

let trackingURI = null;
let pollCount = 0;

function statusPoll(
  dispatch: Function,
  csrf: CsrfState,
  referrerAcquisitionData: ReferrerAcquisitionData,
  paymentMethod: PaymentMethod,
  participations: Participations,
): ?Promise<void> {

  if (pollCount >= MAX_POLLS) {
    trackConversion(participations, routes.recurringContribPending);
    dispatch(checkoutPending(paymentMethod));
    return undefined;
  }

  pollCount += 1;

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
    credentials: 'same-origin',
  };
  if (trackingURI !== null) {
    return fetch(trackingURI, request).then((response) => {
      // eslint-disable-next-line no-use-before-define
      handleStatus(
        response, dispatch, csrf,
        referrerAcquisitionData, paymentMethod, participations,
      );
    });
  }
  return undefined;
}

function delayedStatusPoll(
  dispatch: Function,
  csrf: CsrfState,
  referrerAcquisitionData: ReferrerAcquisitionData,
  paymentMethod: PaymentMethod,
  participations: Participations,
) {
  setTimeout(
    () => statusPoll(dispatch, csrf, referrerAcquisitionData, paymentMethod, participations),
    POLLING_INTERVAL,
  );
}


function handleStatus(
  response: Response,
  dispatch: Function,
  csrf: CsrfState,
  referrerAcquisitionData: ReferrerAcquisitionData,
  paymentMethod: PaymentMethod,
  participations: Participations,
) {

  if (response.ok) {
    response.json().then((statusResponse: StatusResponse) => {
      trackingURI = statusResponse.trackingUri;

      if (statusResponse.guestAccountCreationToken) {
        dispatch(setGuestAccountCreationToken(statusResponse.guestAccountCreationToken));
      }

      switch (statusResponse.status) {
        case 'failure':
          dispatch(checkoutError(statusResponse.failureReason));
          break;
        case 'success':
          trackConversion(participations, routes.recurringContribThankyou);
          dispatch(checkoutSuccess(paymentMethod));
          break;
        default: // pending
          delayedStatusPoll(dispatch, csrf, referrerAcquisitionData, paymentMethod, participations);
      }
    });
  } else if (trackingURI) {
    delayedStatusPoll(dispatch, csrf, referrerAcquisitionData, paymentMethod, participations);
  } else {
    dispatch(checkoutError('unknown'));
  }
}

function postCheckout(
  abParticipations: Participations,
  amount: number,
  csrf: CsrfState,
  currencyId: IsoCurrency,
  contributionType: Contrib,
  dispatch: Dispatch<*>,
  paymentMethod: PaymentMethod,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
  optimizeExperiments: OptimizeExperiments,
): Token => void {
  return (token: Token) => {
    pollCount = 0;
    dispatch(creatingContributor());

    const request = requestData(
      abParticipations,
      amount,
      contributionType,
      currencyId,
      csrf,
      paymentMethodToPaymentFieldMap[paymentMethod],
      referrerAcquisitionData,
      getState,
      token,
      optimizeExperiments,
    );

    fetch(routes.recurringContribCreate, request).then((response) => {
      handleStatus(
        response,
        dispatch,
        csrf,
        referrerAcquisitionData,
        paymentMethod,
        abParticipations,
      );
    });
  };
}

export {
  postCheckout,
  getPaymentFields,
};
