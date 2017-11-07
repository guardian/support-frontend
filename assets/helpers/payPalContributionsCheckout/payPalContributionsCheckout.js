// @flow

// ----- Imports ----- //


import { toCountryGroup } from 'helpers/internationalisation/country';
import { participationsToAcquisitionABTest, getOphanIds } from 'helpers/tracking/acquisitions';
import * as cookie from 'helpers/cookie';
import { addQueryParamToURL } from 'helpers/url';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { OphanIds, AcquisitionABTest, ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';

// ----- Types ----- //

type PayPalPostData = {|
  countryGroup: string,
  amount: number,
  cmp: ?string,
  intCmp: ?string,
  refererPageviewId: ?string,
  refererUrl: ?string,
  ophanPageviewId: string,
  ophanBrowserId: ?string,
  ophanVisitId: ?string,
  supportRedirect: boolean,
  componentId: ?string,
  componentType: ?string,
  source: ?string,
  refererAbTest: ?AcquisitionABTest,
  nativeAbTests: ?AcquisitionABTest[],
|}

// ----- Functions ----- //

function payalContributionEndpoint(testUser) {
  if (testUser) {
    return addQueryParamToURL(
      window.guardian.contributionsPayPalEndpoint,
      '_test_username',
      testUser,
    );
  }

  return window.guardian.contributionsPayPalEndpoint;
}

export function paypalContributionsRedirect(
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  isoCountry: IsoCountry,
  errorHandler: (string) => void,
  nativeAbParticipations: Participations,
): void {

  const country = toCountryGroup(isoCountry);
  const ophanIds: OphanIds = getOphanIds();
  const postData: PayPalPostData = {
    countryGroup: country,
    amount,
    cmp: null,
    intCmp: referrerAcquisitionData.campaignCode,
    refererPageviewId: referrerAcquisitionData.referrerPageviewId,
    refererUrl: referrerAcquisitionData.referrerUrl,
    ophanPageviewId: ophanIds.pageviewId,
    ophanBrowserId: ophanIds.browserId,
    ophanVisitId: ophanIds.visitId,
    supportRedirect: true,
    componentId: referrerAcquisitionData.componentId,
    componentType: referrerAcquisitionData.componentType,
    source: referrerAcquisitionData.source,
    refererAbTest: referrerAcquisitionData.abTest,
    nativeAbTests: participationsToAcquisitionABTest(nativeAbParticipations),
  };

  const fetchOptions: Object = {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  };

  fetch(payalContributionEndpoint(cookie.get('_test_username')), fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((res) => { window.location = res.approvalUrl; })
    .catch(() => errorHandler('Sorry, an error occurred, please try again or use another payment method.'));
}
