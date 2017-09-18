// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';

import { checkoutError } from '../oneoffContributionsActions';
import type { PageState } from '../oneOffContributionsReducers';


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

function requestData(paymentToken: string, getState: () => PageState) {

  const state = getState();

  if (state.page.user.fullName !== null && state.page.user.fullName !== undefined
    && state.page.user.email !== null && state.page.user.email !== undefined) {
    const oneOffContribFields: OneoffContribFields = {
      name: state.page.user.fullName,
      currency: state.page.stripeCheckout.currency,
      amount: state.page.stripeCheckout.amount,
      email: state.page.user.email,
      token: paymentToken,
      marketing: false, // todo: collect marketing preference
      postcode: state.page.user.postcode,
      ophanPageviewId: 'dummy', // todo: correct ophan pageview id
    };

    if (state.common.refpvid) {
      oneOffContribFields.refererPageviewId = state.common.refpvid;
    }

    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oneOffContribFields),
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
  getState: () => PageState,
) {

  const request = requestData(paymentToken, getState);

  return fetch(ONEOFF_CONTRIB_ENDPOINT, request).then((response) => {

    const url: string = addQueryParamToURL(
      routes.oneOffContribThankyou,
      'INTCMP',
      getState().common.intCmp,
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
