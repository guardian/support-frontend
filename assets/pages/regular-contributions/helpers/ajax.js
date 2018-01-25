// @flow

// ----- Imports ----- //


import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import { getOphanIds } from 'helpers/tracking/acquisitions';
import type { BillingPeriod, Contrib } from 'helpers/contributions';
import type { ReferrerAcquisitionData, OphanIds, AcquisitionABTest } from 'helpers/tracking/acquisitions';
import type { UsState, IsoCountry } from 'helpers/internationalisation/country';
import { participationsToAcquisitionABTest } from 'helpers/tracking/acquisitions';
import type { User as UserState } from 'helpers/user/userReducer';
import type { IsoCurrency, Currency } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abTests/abtest';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { checkoutError, creatingContributor } from '../regularContributionsActions';
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
  userId: string,
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

const getPaymentFields =
  (
    token?: string,
    accountNumber?: string,
    sortCode?: string,
    accountHolderName?: string,
    paymentFieldName: string,
    userId: string,
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
            userId,
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
  country: IsoCountry,
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
    user.id,
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
) {

  if (pollCount >= MAX_POLLS) {
    const url: string = addQueryParamToURL(routes.recurringContribPending, 'INTCMP', referrerAcquisitionData.campaignCode);
    window.location.assign(url);
  }

  pollCount += 1;

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
    credentials: 'same-origin',
  };
  if (trackingURI != null) {
    return fetch(trackingURI, request).then((response) => {
      // eslint-disable-next-line no-use-before-define
      handleStatus(response, dispatch, csrf, referrerAcquisitionData);
    });
  }

  return null;
}

function delayedStatusPoll(
  dispatch: Function,
  csrf: CsrfState,
  referrerAcquisitionData: ReferrerAcquisitionData,
) {
  setTimeout(() => statusPoll(dispatch, csrf, referrerAcquisitionData), POLLING_INTERVAL);
}


function handleStatus(
  response: Response,
  dispatch: Function,
  csrf: CsrfState,
  referrerAcquisitionData: ReferrerAcquisitionData,
) {

  if (response.ok) {
    response.json().then((status) => {
      trackingURI = status.trackingUri;

      switch (status.status) {
        case 'pending':
          delayedStatusPoll(dispatch, csrf, referrerAcquisitionData);
          break;
        case 'failure':
          dispatch(checkoutError(status.message));
          break;
        case 'success':
          window.location.assign(addQueryParamToURL(routes.recurringContribThankyou, 'INTCMP', referrerAcquisitionData.campaignCode));
          break;
        default:
          delayedStatusPoll(dispatch, csrf, referrerAcquisitionData);
      }
    });
  } else if (trackingURI) {
    delayedStatusPoll(dispatch, csrf, referrerAcquisitionData);
  } else {
    dispatch(checkoutError());
  }
}


export default function postCheckout(
  abParticipations: Participations,
  amount: number,
  csrf: CsrfState,
  currency: Currency,
  contributionType: Contrib,
  country: IsoCountry,
  dispatch: Function,
  paymentFieldName: PaymentFieldName,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
): Function {
  return (
    token?: string,
    bankAccountNumber?: string,
    bankSortCode?: string,
    bankAccountHolderName?: string,
  ) => {

    pollCount = 0;
    dispatch(creatingContributor());

    const request = requestData(
      abParticipations,
      amount,
      contributionType,
      country,
      currency.iso,
      csrf,
      paymentFieldName,
      referrerAcquisitionData,
      getState,
      token,
      bankAccountNumber,
      bankSortCode,
      bankAccountHolderName,
    );

    return fetch(routes.recurringContribCreate, request).then((response) => {
      handleStatus(response, dispatch, csrf, referrerAcquisitionData);
    });
  };
}
