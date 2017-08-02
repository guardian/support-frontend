// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';

import { checkoutError, setTrackingUri, incrementPollCount, resetPollCount, creatingContributor } from '../actions/monthlyContributionsActions';

// ----- Setup ----- //

const MONTHLY_CONTRIB_ENDPOINT = '/monthly-contributions/create';
const MONTHLY_CONTRIB_THANKYOU = '/monthly-contributions/thankyou';
const MONTHLY_CONTRIB_PENDING = '/monthly-contributions/pending';
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 20;


// ----- Types ----- //

type MonthlyContribFields = {
  contribution: {
    amount: number,
    currency: string,
  },
  paymentFields: {
    stripeToken: string,
  },
  country: string,
  firstName: string,
  lastName: string,
};

type PaymentField = 'baid' | 'stripeToken';


// ----- Functions ----- //

function requestData(paymentFieldName: PaymentField, token: string, getState: Function) {

  const state = getState();

  const monthlyContribFields: MonthlyContribFields = {
    contribution: {
      amount: state.stripeCheckout.amount,
      currency: state.stripeCheckout.currency,
    },
    paymentFields: {
      [paymentFieldName]: token,
    },
    country: state.monthlyContrib.country,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token },
    credentials: 'same-origin',
    body: JSON.stringify(monthlyContribFields),
  };

}

function statusPoll(dispatch: Function, getState: Function) {
  const state = getState();

  if (state.monthlyContrib.pollCount > MAX_POLLS) {
    const url: string = addQueryParamToURL(MONTHLY_CONTRIB_PENDING, 'INTCMP', getState().intCmp);
    window.location.assign(url);
  }

  dispatch(incrementPollCount());

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token },
    credentials: 'same-origin',
  };

  return fetch(state.monthlyContrib.trackingUri, request).then((response) => {
    handleStatus(response, dispatch, getState); // eslint-disable-line no-use-before-define
  });
}

function delayedStatusPoll(dispatch: Function, getState: Function) {
  setTimeout(() => statusPoll(dispatch, getState), POLLING_INTERVAL);
}

function handleStatus(response: Response, dispatch: Function, getState: Function) {
  const state = getState();
  if (response.ok) {
    response.json().then((status) => {
      dispatch(setTrackingUri(status.trackingUri));
      switch (status.status) {
        case 'pending':
          delayedStatusPoll(dispatch, getState);
          break;
        case 'failure':
          dispatch(checkoutError(status.message));
          break;
        case 'success':
          window.location.assign(addQueryParamToURL(MONTHLY_CONTRIB_THANKYOU, 'INTCMP', getState().intCmp));
          break;
        default:
          delayedStatusPoll(dispatch, getState);
      }
    });
  } else if (state.monthlyContrib.trackingUri) {
    delayedStatusPoll(dispatch, getState);
  } else {
    response.text().then(() => dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.')));
  }
}


export default function postCheckout(paymentFieldName: PaymentField): Function {
  return (token: string, dispatch: Function, getState: Function) => {

    dispatch(resetPollCount());
    dispatch(creatingContributor());

    const request = requestData(paymentFieldName, token, getState);

    return fetch(MONTHLY_CONTRIB_ENDPOINT, request).then((response) => {
      handleStatus(response, dispatch, getState);
    });
  };
}
