// @flow

// ----- Imports ----- //

import { checkoutError } from '../actions/oneoffContributionsActions';


// ----- Setup ----- //

const ONEOFF_CONTRIB_ENDPOINT = 'https://contribute.thegulocal.com/stripe/pay'; // todo: this should support DEV/CODE
const ONEOFF_CONTRIB_THANKYOU = '/oneoff-contributions/thankyou';


// ----- Types ----- //

type OneoffContribFields = {
  name: string,
  currency: string,
  amount: number,
  email: string,
  token: string,
  marketing: boolean,
  postcode?: string,
  ophanPageviewId: string,
  ophanBrowserId?: string,
  cmp?: string,
  intcmp?: string,
  refererPageviewId?: string,
  refererUrl?: string,
  idUser?: string,
  platform?: string,
  ophanVisitId?: string
};

// ----- Functions ----- //

function requestData(paymentToken: string, getState: Function) {

  const state = getState();

  const oneoffContribFields: OneoffContribFields = {
    name: state.user.fullName,
    currency: state.stripeCheckout.currency,
    amount: state.stripeCheckout.amount,
    email: state.user.email,
    token: paymentToken,
    marketing: false, // todo: collect marketing preference
    postcode: state.user.postcode,
    ophanPageviewId: 'dummy', // todo: correct ophan pageview id
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
