// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import { participationsToAcquisitionABTest, getOphanIds } from 'helpers/tracking/acquisitions';

import type { OphanIds, AcquisitionABTest, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { Currency, IsoCurrency } from 'helpers/internationalisation/currency';

import { checkoutError } from '../oneoffContributionsActions';

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
  isSupport: ?boolean
};

// ----- Functions ----- //

function requestData(
  abParticipations: Participations,
  paymentToken: string,
  currency: IsoCurrency,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
) {

  const ophanIds: OphanIds = getOphanIds();
  const { user } = getState().page;

  if (user.fullName !== null && user.fullName !== undefined &&
    user.email !== null && user.email !== undefined) {

    const oneOffContribFields: OneOffContribFields = {
      name: user.fullName,
      currency,
      amount,
      email: user.email,
      token: paymentToken,
      marketing: user.gnmMarketing,
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
      nativeAbTests: participationsToAcquisitionABTest(abParticipations),
      refererAbTest: referrerAcquisitionData.abTest,
      isSupport: true,
      queryParameters: referrerAcquisitionData.queryParameters,
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
  abParticipations: Participations,
  dispatch: Function,
  amount: number,
  currency: Currency,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
) {
  return (paymentToken: string) => {
    const request = requestData(
      abParticipations,
      paymentToken,
      currency.iso,
      amount,
      referrerAcquisitionData,
      getState,
    );

    return fetch(ONEOFF_CONTRIB_ENDPOINT, request).then((response) => {

      const url: string = addQueryParamToURL(
        routes.oneOffContribThankyou,
        'INTCMP',
        referrerAcquisitionData.campaignCode,
      );

      if (response.ok) {
        window.location.assign(url);
        return;
      }

      dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
    }).catch(() => {
      dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
    });
  };
}
