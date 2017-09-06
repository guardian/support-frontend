// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';

import { checkoutError } from '../actions/oneoffContributionsActions';
import type { CombinedState } from '../reducers/reducers';


// ----- Setup ----- //

const ONEOFF_CONTRIB_ENDPOINT = window.guardian.contributionsStripeEndpoint;


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
  ophanVisitId?: string,
};


// ----- Functions ----- //

function requestData(paymentToken: string, getState: () => CombinedState) {

  const state = getState();

  if (state.user.fullName !== null && state.user.fullName !== undefined
    && state.user.email !== null && state.user.email !== undefined) {
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

    if (state.refpvid) {
      oneoffContribFields.refererPageviewId = state.refpvid;
    }

    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oneoffContribFields),
      credentials: 'include',
    };
  }

  return Promise.resolve({
    ok: false,
    text: () => 'Failed to process payment - missing fields',
  });
}

export default function postCheckout(
  paymentToken: string,
  dispatch: Function,
  getState: () => CombinedState,
) {

  const request = requestData(paymentToken, getState);

  return fetch(ONEOFF_CONTRIB_ENDPOINT, request).then((response) => {

    const url: string = addQueryParamToURL(
      routes.oneOffContribThankyou,
      'INTCMP',
      getState().intCmp,
    );

    if (response.ok) {
      window.location.assign(url);
      return;
    }

    dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
  }).catch(() => {
    dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
  });

}
