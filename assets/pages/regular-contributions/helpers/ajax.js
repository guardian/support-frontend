// @flow

// ----- Imports ----- //


import { routes } from 'helpers/routes';
import { getOphanIds } from 'helpers/tracking/acquisitions';
import type { BillingPeriod, Contrib } from 'helpers/contributions';
import type { ReferrerAcquisitionData, OphanIds, AcquisitionABTest } from 'helpers/tracking/acquisitions';
import type { UsState, IsoCountry } from 'helpers/internationalisation/country';
import { participationsToAcquisitionABTest } from 'helpers/tracking/acquisitions';
import type { User as UserState } from 'helpers/user/userReducer';
import type { IsoCurrency, Currency } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abTests/abtest';
import { successfulConversion } from 'helpers/tracking/googleTagManager';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { PaymentMethod } from 'helpers/checkouts';

import { checkoutPending, checkoutSuccess, checkoutError, creatingContributor } from '../regularContributionsActions';
import { billingPeriodFromContrib } from '../../../helpers/contributions';

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
|};

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
  (
    token?: string,
    accountNumber?: string,
    sortCode?: string,
    accountHolderName?: string,
    paymentFieldName: string,
  ): ?(PayPalDetails | StripeDetails | DirectDebitDetails
    ) => {
    let response = null;
    switch (paymentFieldName) {
      case 'baid':
        if (token) {
          response = {
            [paymentFieldName]: token,
          };
        }
        break;
      case 'stripeToken':
        if (token) {
          response = {
            [paymentFieldName]: token,
          };
        }
        break;
      case 'directDebitData':
        if (accountHolderName && sortCode && accountNumber) {
          response = {
            accountHolderName,
            sortCode,
            accountNumber,
          };
        }
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
  token?: string,
  accountNumber?: string,
  sortCode?: string,
  accountHolderName?: string,
) {

  const { user } = getState().page;
  const { country } = getState().common;

  if (!isUserValid(user)) {
    return Promise.resolve({
      ok: false,
      text: () => 'Failed to process payment - missing fields',
    });
  }

  const ophanIds: OphanIds = getOphanIds();
  const supportAbTests = participationsToAcquisitionABTest(abParticipations);
  const paymentFields = getPaymentFields(
    token,
    accountNumber,
    sortCode,
    accountHolderName,
    paymentFieldName,
  );

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
    successfulConversion(participations);
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
    response.json().then((status) => {
      trackingURI = status.trackingUri;

      switch (status.status) {
        case 'failure':
          dispatch(checkoutError(status.message));
          break;
        case 'success':
          successfulConversion(participations);
          dispatch(checkoutSuccess(paymentMethod));
          break;
        default: // pending
          delayedStatusPoll(dispatch, csrf, referrerAcquisitionData, paymentMethod, participations);
      }
    });
  } else if (trackingURI) {
    delayedStatusPoll(dispatch, csrf, referrerAcquisitionData, paymentMethod, participations);
  } else {
    dispatch(checkoutError());
  }
}

function postCheckout(
  abParticipations: Participations,
  amount: number,
  csrf: CsrfState,
  currency: Currency,
  contributionType: Contrib,
  dispatch: Function,
  paymentMethod: PaymentMethod,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
): Function {
  return (
    token?: string,
    accountNumber?: string,
    sortCode?: string,
    accountHolderName?: string,
  ) => {

    pollCount = 0;
    dispatch(creatingContributor());

    const request = requestData(
      abParticipations,
      amount,
      contributionType,
      currency.iso,
      csrf,
      paymentMethodToPaymentFieldMap[paymentMethod],
      referrerAcquisitionData,
      getState,
      token,
      accountNumber,
      sortCode,
      accountHolderName,
    );

    return fetch(routes.recurringContribCreate, request).then((response) => {
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
