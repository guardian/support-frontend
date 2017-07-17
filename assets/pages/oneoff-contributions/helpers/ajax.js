// @flow

// ----- Imports ----- //

import { checkoutError } from '../actions/oneoffContributionsActions';


// ----- Setup ----- //

const ONEOFF_CONTRIB_ENDPOINT = '/oneoff-contributions/create';
const ONEOFF_CONTRIB_THANKYOU = '/oneoff-contributions/thankyou';


// ----- Types ----- //

type oneoffContribFields = {
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

  const oneoffContribFields: oneoffContribFields = {
    contribution: {
      amount: state.stripeCheckout.amount,
      currency: state.stripeCheckout.currency,
    },
    paymentFields: {
      stripeToken: paymentToken,
    },
    country: state.oneoffContrib.country,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token },
    credentials: 'same-origin',
    body: JSON.stringify(oneoffContribFields),
  };

}

export default function postCheckout(
  paymentToken: string,
  dispatch: Function,
  getState: Function,
) {

  const request = requestData(paymentToken, getState);

  return fetch(ONEOFF_CONTRIB_ENDPOINT, request).then((response) => {

    if (response.ok) {
      window.location.assign(ONEOFF_CONTRIB_THANKYOU);
    }

    response.text().then(err => dispatch(checkoutError(err)));

  });

}
