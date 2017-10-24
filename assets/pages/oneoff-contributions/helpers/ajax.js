// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import { participationsToAcquisitionABTest, getOphanIds } from 'helpers/tracking/acquisitions';

import type { OphanIds, AcquisitionABTest } from 'helpers/tracking/acquisitions';

import { checkoutError } from '../oneoffContributionsActions';
import type { PageState } from '../oneOffContributionsReducers';


// ----- Setup ----- //

const ONEOFF_CONTRIB_ENDPOINT = window.guardian.contributionsStripeEndpoint;


// ----- Types ----- //

type OneOffContribFields = {
  name: string,
  currency: string,
  amount: number,
  email: string,
  token: string,
  marketing: boolean,
  postcode: ?string,
  ophanPageviewId: string,
  ophanBrowserId: ?string,
  cmp: ?string,
  intcmp: ?string,
  refererPageviewId: ?string,
  refererUrl: ?string,
  idUser: ?string,
  platform: ?string,
  ophanVisitId: ?string,
  componentId: ?string,
  componentType: ?string,
  source: ?string,
  nativeAbTests: ?AcquisitionABTest[],
  refererAbTest: ?AcquisitionABTest,
};

// ----- Functions ----- //

function requestData(paymentToken: string, getState: () => PageState) {

  const state = getState();
  const { user } = state.page;
  const ophanIds: OphanIds = getOphanIds();

  if (user.fullName !== null && user.fullName !== undefined &&
    user.email !== null && user.email !== undefined) {
    const { referrerAcquisitionData } = state.common;

    const oneOffContribFields: OneOffContribFields = {
      name: user.fullName,
      currency: state.page.stripeCheckout.currency,
      amount: state.page.stripeCheckout.amount,
      email: user.email,
      token: paymentToken,
      marketing: user.gnmMarketing,
      postcode: user.postcode,
      ophanPageviewId: ophanIds.pageviewId,
      ophanBrowserId: ophanIds.browserId,
      ophanVisitId: ophanIds.visitId,
      idUser: user.id,
      cmp: null,
      platform: null,
      intcmp: referrerAcquisitionData.campaignCode,
      refererPageviewId: referrerAcquisitionData.referrerPageviewId,
      refererUrl: referrerAcquisitionData.referrerUrl,
      componentId: referrerAcquisitionData.componentId,
      componentType: referrerAcquisitionData.componentType,
      source: referrerAcquisitionData.source,
      nativeAbTests: participationsToAcquisitionABTest(state.common.abParticipations),
      refererAbTest: referrerAcquisitionData.abTest,
    };

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
      getState().common.referrerAcquisitionData.campaignCode,
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
