// @flow

// ----- Imports ----- //

import { checkoutError } from '../actions/monthlyContributionsActions';


// ----- Setup ----- //

const MONTHLY_CONTRIB_ENDPOINT = '/monthly-contributions/create';
const MONTHLY_CONTRIB_THANKYOU = '/monthly-contributions/thankyou';


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


// ----- Functions ----- //

function requestData(paymentToken: string, getState: Function) {

  const state = getState();

  const monthlyContribFields: MonthlyContribFields = {
    contribution: {
      amount: state.stripeCheckout.amount,
      currency: state.stripeCheckout.currency,
    },
    paymentFields: {
      stripeToken: paymentToken,
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

export default function postCheckout(
  paymentToken: string,
  dispatch: Function,
  getState: Function,
) {

  const request = requestData(paymentToken, getState);

  return fetch(MONTHLY_CONTRIB_ENDPOINT, request).then((response) => {

    if (response.ok) {
      window.location.assign(MONTHLY_CONTRIB_THANKYOU);
    }

    response.text().then(err => dispatch(checkoutError(err)));

  });

}
